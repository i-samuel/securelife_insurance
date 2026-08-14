import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import CrmLayout from './layouts/CrmLayout';

// Guard Components
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Views
import HomeView from './views/public/HomeView';
import PlansView from './views/public/PlansView';
import QuoteView from './views/public/QuoteView';
import LoginView from './views/crm/LoginView';
import DashboardView from './views/crm/DashboardView';
import LeadsView from './views/crm/LeadsView';
import InsurancePlansView from './views/crm/InsurancePlansView';
import UsersView from './views/crm/UsersView';
import ProfileView from './views/crm/ProfileView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomeView />
              </PublicLayout>
            }
          />
          <Route
            path="/plans"
            element={
              <PublicLayout>
                <PlansView />
              </PublicLayout>
            }
          />
          <Route
            path="/quote"
            element={
              <PublicLayout>
                <QuoteView />
              </PublicLayout>
            }
          />

          {/* CRM Staff Login Route */}
          <Route path="/crm/login" element={<LoginView />} />

          {/* Protected Internal CRM Routes */}
          <Route
            path="/crm/dashboard"
            element={
              <ProtectedRoute>
                <CrmLayout>
                  <DashboardView />
                </CrmLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/crm/leads"
            element={
              <ProtectedRoute>
                <CrmLayout>
                  <LeadsView />
                </CrmLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/crm/plans"
            element={
              <ProtectedRoute>
                <CrmLayout>
                  <InsurancePlansView />
                </CrmLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/crm/users"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <CrmLayout>
                    <UsersView />
                  </CrmLayout>
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/crm/profile"
            element={
              <ProtectedRoute>
                <CrmLayout>
                  <ProfileView />
                </CrmLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
