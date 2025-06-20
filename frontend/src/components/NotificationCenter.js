import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { notifications, markAsRead, clearAll } = useNotifications();

  // Get locale for date formatting
  const getLocale = () => {
    return i18n.language === 'ka' ? ka : enUS;
  };

  const NotificationItem = ({ notification }) => {
    const { type, title, message, timestamp, read } = notification;

    // Get icon based on notification type
    const getIcon = () => {
      switch (type) {
        case 'project_created':
        case 'project_updated':
          return 'fas fa-building';
        case 'event_created':
        case 'event_updated':
        case 'event_cancelled':
          return 'fas fa-calendar-alt';
        case 'file_uploaded':
        case 'file_updated':
          return 'fas fa-file';
        case 'wiki_created':
        case 'wiki_updated':
          return 'fas fa-book';
        case 'task_assigned':
        case 'task_completed':
          return 'fas fa-tasks';
        case 'reminder':
          return 'fas fa-clock';
        default:
          return 'fas fa-bell';
      }
    };

    return (
      <div
        className={`p-4 ${
          read ? 'bg-white' : 'bg-primary-50'
        } hover:bg-gray-50 transition-colors duration-150 cursor-pointer`}
        onClick={() => markAsRead(notification.id)}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i
              className={`${getIcon()} text-primary-500 text-lg`}
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            <p className="mt-1 text-xs text-gray-400">
              {formatDistanceToNow(new Date(timestamp), {
                addSuffix: true,
                locale: getLocale()
              })}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-50"
        onClose={onClose}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={React.Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={React.Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  {/* Header */}
                  <div className="px-4 py-6 bg-primary-500 sm:px-6">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-medium text-white flex items-center">
                        <BellIcon className="h-6 w-6 mr-2" aria-hidden="true" />
                        {t('notifications.title')}
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={onClose}
                        >
                          <span className="sr-only">{t('common.close')}</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-white">
                      {notifications.length
                        ? t('notifications.count', { count: notifications.length })
                        : t('notifications.empty')}
                    </div>
                  </div>

                  {/* Notification list */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="divide-y divide-gray-200">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                        />
                      ))}
                    </div>

                    {/* Empty state */}
                    {notifications.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <BellIcon
                          className="h-12 w-12 text-gray-400"
                          aria-hidden="true"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          {t('notifications.noNotifications')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="border-t border-gray-200 p-4">
                      <button
                        type="button"
                        className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        onClick={clearAll}
                      >
                        {t('notifications.clearAll')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default NotificationCenter;
