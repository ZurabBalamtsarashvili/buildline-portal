import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const AuthLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Language selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-16 w-auto"
          src="/logo.svg"
          alt="Buildline"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('auth.welcome')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.description')}
        </p>
      </div>

      {/* Auth content */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Buildline Construction Portal.{' '}
          {t('common.allRightsReserved')}
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
