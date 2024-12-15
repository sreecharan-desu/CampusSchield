import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../components/Alert';
import MobileLayout from '../components/MobileLayout';
import { BASE_URL } from '../BASE_URL';

export default function Report() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
  });

  // Get current location when component mounts
  useEffect(() => {
    detectCurrentLocation();
  }, []);

  const detectCurrentLocation = () => {
    setDetectingLocation(true);
  
    // Check if the device is mobile
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      // If it's a mobile device, ask for geolocation permission
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async ({ coords: { latitude, longitude } }) => {
            try {
              const { data } = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const address = data.display_name;
              setCurrentLocation({ latitude, longitude, address });
              setFormData(prev => ({ ...prev, location: address }));
            } catch (error) {
              console.error('Error fetching address from coordinates:', error);
              showAlert('Failed to detect location automatically', 'error');
            }
          },
          () => {
            showAlert('Location permission denied', 'error');
            setDetectingLocation(false);
          }
        );
      } else {
        showAlert('Geolocation not supported on mobile device', 'error');
        setDetectingLocation(false);
      }
    } else {
      // For web browsers, use IP-based location detection
      fetchLocationByIP();
    }
  };

  const fetchLocationByIP = () => {
    axios.get("https://ipinfo.io/8.8.8.8/json?token=e1404e937d4bfd")
      .then(async (response) => {
        const { loc } = response.data;
        const [latitude, longitude] = loc.split(',');
        try {
          const { data } = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const address = data.display_name;
          setCurrentLocation({ latitude, longitude, address });
          setFormData(prev => ({ ...prev, location: address }));
        } catch (error) {
          console.error('Error fetching address from coordinates:', error);
          showAlert('Failed to detect location based on IP', 'error');
        }
      })
      .catch(error => {
        console.error('Error fetching IP-based location:', error);
        showAlert('Failed to detect location based on IP', 'error');
      })
      .finally(() => {
        setDetectingLocation(false);
      });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reportData = {
        ...formData,
        coordinates: currentLocation ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        } : null
      };

      const res = await axios.post(
        `${BASE_URL}api/reports`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      

      showAlert(res.msg,res.success);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Submit error:', error);
      showAlert(error.response?.data?.error || 'Failed to submit report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  return (
    <MobileLayout header="Submit Report">
      <div className="max-w-lg mx-auto p-4">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Incident
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select incident type</option>
              <option value="harassment">Harassment</option>
              <option value="theft">Theft</option>
              <option value="assault">Assault</option>
              <option value="vandalism">Vandalism</option>
              <option value="suspicious_activity">Suspicious Activity</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows="4"
              required
              placeholder="Please provide details about the incident..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="flex-1 p-2 border rounded-md"
                required
                placeholder="Enter location or use auto-detect"
              />
              <button
                type="button"
                onClick={detectCurrentLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={detectingLocation}
              >
                {detectingLocation ? (
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Detect'
                )}
              </button>
            </div>
            {currentLocation && (
              <p className="mt-1 text-sm text-gray-500">
                Detected at: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </MobileLayout>
  );
} 