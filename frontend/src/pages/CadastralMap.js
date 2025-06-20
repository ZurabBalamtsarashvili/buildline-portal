import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CadastralMap = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('navigation.cadastralMap')}
        </h1>
        <a
          href="https://maps.gov.ge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
        >
          {t('common.openInNewTab')}
        </a>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-500">{t('common.loading')}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('errors.mapLoadError')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('errors.mapLoadErrorDescription')}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                       rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Map iframe */}
        <div className="relative" style={{ paddingTop: '75%' }}>
          <iframe
            src="https://maps.gov.ge/map/portal"
            className="absolute inset-0 w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Cadastral Map"
            allow="geolocation"
          />
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('cadastralMap.instructions')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">1</span>
              </div>
            </div>
            <p className="text-gray-600">
              {t('cadastralMap.instruction1')}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">2</span>
              </div>
            </div>
            <p className="text-gray-600">
              {t('cadastralMap.instruction2')}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">3</span>
              </div>
            </div>
            <p className="text-gray-600">
              {t('cadastralMap.instruction3')}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-500">
            {t('cadastralMap.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastralMap;
