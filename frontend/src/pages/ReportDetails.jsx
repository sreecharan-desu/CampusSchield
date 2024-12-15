import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MobileLayout from '../components/MobileLayout';
import { ClockIcon, MapPinIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { BASE_URL } from '../BASE_URL';

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const user = useRecoilValue(userState);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(response.data);
      } catch (error) {
        console.error('Failed to fetch report:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  if (loading) {
    return (
      <MobileLayout header="Report Details">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout 
      header="Report Details" 
      showBackButton 
      onBack={() => navigate('/')}
    >
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {report.incidentType}
            </h2>
            <span className={`px-2 py-1 rounded-full text-xs ${
              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              report.status === 'resolved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {report.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>{new Date(report.timestamp).toLocaleString()}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{report.location}</span>
            </div>

            <div className="flex items-start text-gray-600">
              <BellAlertIcon className="h-5 w-5 mr-2 mt-1" />
              <p className="flex-1">{report.description}</p>
            </div>
          </div>
        </div>

        {report.updates && report.updates.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Updates</h3>
            <div className="space-y-4">
              {report.updates.map((update, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4">
                  <p className="text-gray-600">{update.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(update.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
} 