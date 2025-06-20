import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();
  
  const getStatusColor = (status) => {
    const colors = {
      planning: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      on_hold: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {project.image && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
            {t(`projects.status.${project.status}`)}
          </span>
        </div>
        <p className="mt-2 text-gray-600">{project.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-500">{project.startDate}</span>
          </div>
          <div className="flex -space-x-2">
            {project.team.map((member, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                title={member.name}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in a real app, this would come from an API
  const projects = [
    {
      id: 1,
      title: 'Office Building Complex',
      description: 'Modern office complex with sustainable design features',
      status: 'in_progress',
      startDate: '2024-01-15',
      team: [
        { name: 'John Doe', avatar: null },
        { name: 'Jane Smith', avatar: null },
      ],
    },
    {
      id: 2,
      title: 'Residential Apartments',
      description: 'Luxury apartment complex with 200 units',
      status: 'planning',
      startDate: '2024-03-01',
      team: [
        { name: 'Mike Johnson', avatar: null },
        { name: 'Sarah Wilson', avatar: null },
      ],
    },
    {
      id: 3,
      title: 'Shopping Mall Renovation',
      description: 'Complete renovation of existing shopping mall',
      status: 'completed',
      startDate: '2023-08-15',
      team: [
        { name: 'Tom Brown', avatar: null },
        { name: 'Lisa Davis', avatar: null },
      ],
    },
  ];

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">{t('projects.title')}</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
                   text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('projects.create')}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t('projects.noProjects')}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Projects;
