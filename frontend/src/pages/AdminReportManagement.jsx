import { useState, useEffect } from 'react';
import axios from 'axios';
import MobileLayout from '../components/MobileLayout';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BASE_URL } from '../BASE_URL';

export default function AdminReportManagement() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}api/admin/reports?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${BASE_URL}api/admin/reports/${reportId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchReports();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredReports = reports.filter(report => 
    report.incidentType.toLowerCase().includes(search.toLowerCase()) ||
    report.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MobileLayout header="Report Management">
      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            filteredReports.map((report) => (
              <div key={report._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-900">
                      {report.incidentType}
                    </span>
                    <p className="text-sm text-gray-500">
                      Reported by: {report.isAnonymous ? 'Anonymous' : report.userId?.name}
                    </p>
                  </div>
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                    className={`text-sm rounded-full px-3 py-1 ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Location: {report.location}</span>
                  <span>{new Date(report.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
} 