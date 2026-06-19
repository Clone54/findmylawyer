import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import BrowseLawyers from './pages/BrowseLawyers';
import LawyerDetails from './pages/LawyerDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';
import { FullScreenLoading } from './components/LoadingScreen';

import Profile from './pages/dashboard/Profile';

// Dashboards (User)
import UserHiringHistory from './pages/dashboard/user/UserHiringHistory';
import UserComments from './pages/dashboard/user/UserComments';

// Dashboards (Lawyer)
import LawyerHiringHistory from './pages/dashboard/lawyer/LawyerHiringHistory';
import ManageLegalProfile from './pages/dashboard/lawyer/ManageLegalProfile';

// Dashboards (Admin)
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import AllTransactions from './pages/dashboard/admin/AllTransactions';
import AnalyticsOverview from './pages/dashboard/admin/AnalyticsOverview';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoading message="Initializing Application..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <GoogleOAuthProvider clientId="946959917364-jeh8nn3lv3fr155ol84pp13h4dq2j5k1.apps.googleusercontent.com">
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-center" />
          <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="browse" element={<BrowseLawyers />} />
            <Route path="lawyer/:id" element={<LawyerDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            
            {/* User */}
            <Route path="user/hiring-history" element={<PrivateRoute allowedRoles={['user']}><UserHiringHistory /></PrivateRoute>} />
            <Route path="user/comments" element={<PrivateRoute allowedRoles={['user']}><UserComments /></PrivateRoute>} />

            {/* Lawyer */}
            <Route path="lawyer/hiring-history" element={<PrivateRoute allowedRoles={['lawyer']}><LawyerHiringHistory /></PrivateRoute>} />
            <Route path="lawyer/manage-legal-profile" element={<PrivateRoute allowedRoles={['lawyer']}><ManageLegalProfile /></PrivateRoute>} />
            
            {/* Admin */}
            <Route path="admin/manage-users" element={<PrivateRoute allowedRoles={['admin']}><ManageUsers /></PrivateRoute>} />
            <Route path="admin/all-transactions" element={<PrivateRoute allowedRoles={['admin']}><AllTransactions /></PrivateRoute>} />
            <Route path="admin/analytics" element={<PrivateRoute allowedRoles={['admin']}><AnalyticsOverview /></PrivateRoute>} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
