import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}api/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data.reports);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  return { reports, loading, error, fetchReports };
}; 