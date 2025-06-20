import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const WikiPage = ({ title, content, lastModified, author }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600 line-clamp-3">{content}</p>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{author}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{lastModified}</span>
        </div>
      </div>
    </div>
  </div>
);

const Wiki = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample wiki pages - in a real app, this would come from an API
  const wikiPages = [
    {
      id: 1,
      title: 'Construction Safety Guidelines',
      content: 'Comprehensive guide for ensuring safety on construction sites...',
      lastModified: '2024-01-15',
      author: 'John Doe'
    },
    {
      id: 2,
      title: 'Project Documentation Standards',
      content: 'Standards and templates for documenting construction projects...',
      lastModified: '2024-01-10',
      author: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Quality Control Procedures',
      content: 'Detailed procedures for maintaining quality in construction...',
      lastModified: '2024-01-05',
      author: 'Mike Johnson'
    }
  ];

  const filteredPages = wikiPages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">{t('wiki.title')}</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
                   text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('wiki.create')}
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('common.search')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                     placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 
                     focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Wiki Pages Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPages.map(page => (
          <WikiPage
            key={page.id}
            title={page.title}
            content={page.content}
            lastModified={page.lastModified}
            author={page.author}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t('wiki.noPages')}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Wiki;
