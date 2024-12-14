import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import { useReports } from '../hooks/useReports';
import MobileLayout from '../components/MobileLayout';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ShieldExclamationIcon,
  PlusCircleIcon,
  BookOpenIcon,
  BellAlertIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const user = useRecoilValue(userState);
  const { reports, loading, error, fetchReports } = useReports();
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

  useEffect(() => {
    if (token) {
      fetchReports();
    }
  }, [token]);

  useEffect(() => {
    if (reports) {
      const filtered = reports.filter(report => 
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  }, [reports, searchTerm]);

  // Guest Home Screen - only show if no token exists
  if (!token) {
    return (
      <MobileLayout header="Campus Safety">
        <motion.div 
          className="p-6 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <ShieldExclamationIcon className="h-24 w-24 mx-auto text-indigo-600 mb-6" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Campus Shield</h1>
            <p className="text-gray-600 mb-8">Your personal safety companion on campus</p>
          </div>

          <div className="space-y-4">
            <Link to="/register">
              <motion.div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h2 className="text-xl font-semibold mb-2">Create Account</h2>
                <p className="text-indigo-100 text-sm">Join our community and stay protected</p>
              </motion.div>
            </Link>

            <Link to="/login">
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:border-indigo-500 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600 text-sm">Welcome back to Campus Shield</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </MobileLayout>
    );
  }

  // Authenticated Home Screen - show if token exists
  return (
    <MobileLayout header="Home">
      <div className="pb-20">
        {/* Welcome Section with username from user state */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-indigo-100">
            Stay safe and connected with campus security
          </p>
        </div>

        {/* Quick Actions */}
        <div className="p-4 grid grid-cols-2 gap-4 -mt-6">
          <Link to="/report">
            <motion.div
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BellAlertIcon className="h-6 w-6 text-red-500 mb-2" />
              <h3 className="font-medium text-gray-900">Report Incident</h3>
              <p className="text-sm text-gray-600">Submit new report</p>
            </motion.div>
          </Link>
          <Link to="/resources">
            <motion.div
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BookOpenIcon className="h-6 w-6 text-indigo-500 mb-2" />
              <h3 className="font-medium text-gray-900">Resources</h3>
              <p className="text-sm text-gray-600">Safety guides</p>
            </motion.div>
          </Link>
        </div>

        {/* Reports Section */}
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Your Reports</h2>
            <Link 
              to="/report" 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              New Report
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Reports List */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2].map(n => (
                  <div key={n} className="h-24 bg-gray-100 rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                {error}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm ? 'No reports match your search' : 'No reports yet'}
                </p>
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredReports.map((report) => (
                  <Link key={report._id} to={`/report/${report._id}`}>
                    <motion.div
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{report.type}</h3>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{report.location}</span>
                            <span>•</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'resolved' 
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'investigating'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileLayout>
  );
}

const features = [
  {
    icon: ShieldExclamationIcon,
    title: 'Instant Reporting',
    description: 'Report incidents quickly and securely'
  },
  {
    icon: BookOpenIcon,
    title: 'Resources',
    description: 'Access safety guides and information'
  },
  // Add more features as needed
]; 