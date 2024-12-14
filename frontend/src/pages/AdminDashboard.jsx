import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';
import axios from 'axios';
import MobileLayout from '../components/MobileLayout';
import { ChartBarIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const user = useRecoilValue(userState);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(r => r.status === 'pending').length;
      const resolved = response.data.filter(r => r.status === 'resolved').length;
      setStats({ total, pending, resolved });
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/admin/reports/${reportId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchReports();
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  return (
    <MobileLayout header="Admin Dashboard">
      <div className="p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <div className="text-sm text-yellow-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="text-sm text-green-600">Resolved</div>
            <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{report.incidentType}</h4>
                  <p className="text-sm text-gray-500">
                    By: {report.userId?.name || 'Anonymous'}
                  </p>
                </div>
                <select
                  value={report.status}
                  onChange={(e) => updateReportStatus(report._id, e.target.value)}
                  className="text-sm border rounded-lg px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <p className="text-sm text-gray-600">{report.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(report.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
} 