import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon, 
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { BASE_URL } from '../BASE_URL';

export default function AdminDashboard() {
  // const user = useRecoilValue(userState);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    investigating: 0
  });

  // Helper function to shorten location
  const shortenLocation = (location) => {
    const parts = location.split(',');
    return `${parts[0]}, ${parts[1]}`; // Returns first two parts of the address
  };

  // Helper function to create Google Maps URL
  const getGoogleMapsUrl = (latitude, longitude) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(r => r.status === 'pending').length;
      const resolved = response.data.filter(r => r.status === 'resolved').length;
      const investigating = response.data.filter(r => r.status === 'investigating').length;
      setStats({ total, pending, resolved, investigating });
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${BASE_URL}api/admin/reports/${reportId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchReports();
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  return (
    <div className="pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-indigo-100">Manage campus safety reports</p>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 -mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Reports</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-sm text-yellow-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-sm text-blue-600">Investigating</div>
          <div className="text-2xl font-bold text-blue-700">{stats.investigating}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600">Resolved</div>
          <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900 capitalize">{report.type}</h4>
                  <p className="text-sm text-gray-500">
                    By: {report.userId?.name} ({report.userId?.studentId})
                  </p>
                </div>
                <select
                  value={report.status}
                  onChange={(e) => updateReportStatus(report._id, e.target.value)}
                  className={`text-sm rounded-full px-3 py-1 font-medium ${
                    report.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : report.status === 'investigating'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <p className="text-sm text-gray-600 mb-2">{report.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center justify-between">
                  <p>Location: {shortenLocation(report.location)}</p>
                  <a 
                    href={getGoogleMapsUrl(report.coordinates.latitude, report.coordinates.longitude)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    View Map
                  </a>
                </div>
                <p>Reported: {new Date(report.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-4">
        <Link 
          to="/admin" 
          className="flex flex-col items-center text-indigo-600"
        >
          <ClipboardDocumentListIcon className="h-6 w-6" />
          <span className="text-xs">Reports</span>
        </Link>

        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/admin/login';
          }}
          className="flex flex-col items-center text-gray-500 hover:text-red-600"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span className="text-xs">Logout</span>
        </button>
      </nav>
    </div>
  );
} 