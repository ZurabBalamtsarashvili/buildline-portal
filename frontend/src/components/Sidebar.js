import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  {
    name: 'navigation.dashboard',
    path: '/dashboard',
    icon: 'fas fa-chart-line',
    roles: ['admin', 'coworker', 'customer']
  },
  {
    name: 'navigation.projects',
    path: '/projects',
    icon: 'fas fa-building',
    roles: ['admin', 'coworker', 'customer']
  },
  {
    name: 'navigation.wiki',
    path: '/wiki',
    icon: 'fas fa-book',
    roles: ['admin', 'coworker']
  },
  {
    name: 'navigation.calendar',
    path: '/calendar',
    icon: 'fas fa-calendar-alt',
    roles: ['admin', 'coworker', 'customer']
  },
  {
    name: 'navigation.contact',
    path: '/contact',
    icon: 'fas fa-envelope',
    roles: ['admin', 'coworker', 'customer']
  },
  {
    name: 'navigation.cadastralMap',
    path: '/cadastral-map',
    icon: 'fas fa-map',
    roles: ['admin', 'coworker', 'customer']
  }
];

const Sidebar = ({ isOpen = true, onClose = () => {}, className = '' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.role)
  );

  const NavItem = ({ item }) => {
    const isActive = location.pathname.startsWith(item.path);

    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
            isActive
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
          }`
        }
      >
        <i
          className={`${item.icon} w-6 h-6 mr-3 ${
            isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'
          }`}
        />
        {t(item.name)}
      </NavLink>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4">
        <img
          className="h-8 w-auto"
          src="/logo.svg"
          alt="Buildline"
        />
        <span className="ml-2 text-xl font-semibold text-gray-900">
          Buildline
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {filteredNavigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* User profile */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={user?.photo_url || '/default-avatar.png'}
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user?.full_name}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                {t(`roles.${user?.role}`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={onClose}
        >
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={React.Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white glass-bg">
              <Transition.Child
                as={React.Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={onClose}
                  >
                    <span className="sr-only">{t('common.close')}</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <SidebarContent />
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className={`hidden md:flex md:flex-shrink-0 ${className}`}>
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 glass-bg">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
