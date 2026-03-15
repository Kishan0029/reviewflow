import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import CustomerFeedbackPage from '@/pages/CustomerFeedbackPage';
import DashboardApp from '@/pages/DashboardApp';
import ProtectedRoute from '@/components/ProtectedRoute';

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/f/:slug" element={<CustomerFeedbackPage />} />
          <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
          <Route path="/signup" element={<AuthRedirect><SignupPage /></AuthRedirect>} />
          <Route path="/dashboard/*" element={<ProtectedRoute><DashboardApp /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
