import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check role-based access if roles are specified
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // User's role is not authorized - redirect to home page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="glass-card max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <i className="fas fa-exclamation-circle text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="glass-button text-primary-600 hover:text-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return children;
};

export default PrivateRoute;
