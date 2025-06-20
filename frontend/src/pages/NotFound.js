import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">{t('errors.notFound')}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md 
                   shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('common.back')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
