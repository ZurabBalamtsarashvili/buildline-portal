import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useTranslation } from 'react-i18next';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Wiki from './pages/Wiki';
import Calendar from './pages/Calendar';
import Contact from './pages/Contact';
import CadastralMap from './pages/CadastralMap';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { isAuthenticated, checkAuth } = useAuth();
  const { initializeNotifications } = useNotifications();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
    
    // Initialize WebSocket notifications if authenticated
    if (isAuthenticated) {
      initializeNotifications();
    }
  }, [isAuthenticated, checkAuth, initializeNotifications]);

  // Set document direction based on language
  useEffect(() => {
    document.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={
              !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
            } />
          </Route>

          {/* Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={
              <Navigate to="/dashboard" replace />
            } />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/projects/*" element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            } />
            
            <Route path="/wiki/*" element={
              <PrivateRoute roles={['admin', 'coworker']}>
                <Wiki />
              </PrivateRoute>
            } />
            
            <Route path="/calendar" element={
              <PrivateRoute>
                <Calendar />
              </PrivateRoute>
            } />
            
            <Route path="/contact" element={
              <PrivateRoute>
                <Contact />
              </PrivateRoute>
            } />
            
            <Route path="/cadastral-map" element={
              <PrivateRoute>
                <CadastralMap />
              </PrivateRoute>
            } />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
