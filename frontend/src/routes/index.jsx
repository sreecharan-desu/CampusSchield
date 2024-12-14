import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

// Page imports
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Report from '../pages/Report';
import ReportDetails from '../pages/ReportDetails';
import Profile from '../pages/Profile';
import Resources from '../pages/Resources';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import AdminReportManagement from '../pages/AdminReportManagement';
import AdminAnalytics from '../pages/AdminAnalytics';

export default function Routes() {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected User Routes */}
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/:id"
        element={
          <ProtectedRoute>
            <ReportDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <AdminReportManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />
    </RouterRoutes>
  );
} 