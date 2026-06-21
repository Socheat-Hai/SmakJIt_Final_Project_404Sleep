import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/Toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import AdminLayout from '../components/AdminLayout';

import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import RoleSelection from '../pages/RoleSelection';
import Register from '../pages/Register';
import InterestSurvey from '../pages/InterestSurvey';
import Opportunities from '../pages/Opportunities';
import OpportunityDetail from '../pages/OpportunityDetail';
import ApplySuccess from '../pages/ApplySuccess';
import Profile from '../pages/Profile';
import CreateOpportunity from '../pages/CreateOpportunity';
import MyOpportunities from '../pages/MyOpportunities';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminOrganizationVerification from '../pages/admin/AdminOrganizationVerification';
import AdminOpportunities from '../pages/admin/AdminOpportunities';
import AdminApplications from '../pages/admin/AdminApplications';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="verifications" element={<AdminOrganizationVerification />} />
          <Route path="opportunities" element={<AdminOpportunities />} />
          <Route path="applications" element={<AdminApplications />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/survey" element={
            <ProtectedRoute><InterestSurvey /></ProtectedRoute>
          } />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/create" element={
            <ProtectedRoute><CreateOpportunity /></ProtectedRoute>
          } />
          <Route path="/my-opportunities" element={
            <ProtectedRoute><MyOpportunities /></ProtectedRoute>
          } />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/opportunities/:id/apply-success" element={
            <ProtectedRoute><ApplySuccess /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
