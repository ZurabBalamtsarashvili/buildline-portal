import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import LanguageSelector from './LanguageSelector';

const Navbar = ({ pageTitle, onMenuClick, onNotificationsClick }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const userNavigation = [
    {
      name: t('navbar.profile'),
      icon: UserCircleIcon,
      onClick: () => {/* TODO: Implement profile view */}
    },
    {
      name: t('navbar.settings'),
      icon: CogIcon,
      onClick: () => {/* TODO: Implement settings */}
    },
    {
      name: t('navbar.logout'),
      icon: ArrowRightOnRectangleIcon,
      onClick: logout
    }
  ];

  return (
    <nav className="glass-bg border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">{t('navbar.openMenu')}</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Page title */}
            <div className="flex-1 flex items-center lg:ml-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <LanguageSelector />

            {/* Notifications */}
            <button
              type="button"
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={onNotificationsClick}
            >
              <span className="sr-only">{t('navbar.notifications')}</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
                <span className="sr-only">{t('navbar.userMenu')}</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.photo_url || '/default-avatar.png'}
                  alt=""
                />
              </Menu.Button>

              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>

                    {/* Navigation items */}
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                            onClick={item.onClick}
                          >
                            <item.icon
                              className="mr-3 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            {item.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
