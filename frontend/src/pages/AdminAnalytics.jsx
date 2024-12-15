import { useState, useEffect } from 'react';
import axios from 'axios';
import MobileLayout from '../components/MobileLayout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { BASE_URL } from '../BASE_URL';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    incidentTypes: {},
    monthlyReports: {},
    statusDistribution: {},
    locationHotspots: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout header="Analytics">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const pieChartData = {
    labels: Object.keys(analytics.incidentTypes),
    datasets: [{
      data: Object.values(analytics.incidentTypes),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  const barChartData = {
    labels: Object.keys(analytics.monthlyReports),
    datasets: [{
      label: 'Monthly Reports',
      data: Object.values(analytics.monthlyReports),
      backgroundColor: '#36A2EB'
    }]
  };

  return (
    <MobileLayout header="Analytics">
      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Reports</h3>
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(analytics.incidentTypes).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Resolution Rate</h3>
            <p className="text-2xl font-bold text-green-600">
              {Math.round((analytics.statusDistribution.resolved || 0) / 
                Object.values(analytics.statusDistribution).reduce((a, b) => a + b, 0) * 100)}%
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Incident Types</h3>
          <div className="h-64">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-64">
            <Bar 
              data={barChartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Location Hotspots */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location Hotspots</h3>
          <div className="space-y-2">
            {Object.entries(analytics.locationHotspots)
              .sort(([,a], [,b]) => b - a)
              .map(([location, count]) => (
                <div key={location} className="flex justify-between items-center">
                  <span className="text-gray-600">{location}</span>
                  <span className="text-gray-900 font-medium">{count} reports</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 