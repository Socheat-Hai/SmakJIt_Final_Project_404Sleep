import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/Toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import RoleSelection from '../pages/RoleSelection';
import Register from '../pages/Register';
import OrganizationDetails from '../pages/OrganizationDetails';
import InterestSurvey from '../pages/InterestSurvey';
import Opportunities from '../pages/Opportunities';
import OpportunityDetail from '../pages/OpportunityDetail';
import ApplySuccess from '../pages/ApplySuccess';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/organization-details" element={<OrganizationDetails />} />
                <Route path="/survey" element={
                  <ProtectedRoute><InterestSurvey /></ProtectedRoute>
                } />
                <Route path="/opportunities" element={<Opportunities />} />
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
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
