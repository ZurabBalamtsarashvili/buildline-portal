import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  {
    code: 'ka',
    name: 'ქართული',
    flag: '🇬🇪'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧'
  }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    // Store language preference
    localStorage.setItem('preferred_language', languageCode);
    // Update document direction and lang attribute
    document.dir = i18n.dir();
    document.documentElement.lang = languageCode;
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        <GlobeAltIcon className="h-5 w-5 mr-2" aria-hidden="true" />
        <span>{currentLanguage?.flag}</span>
        <span className="ml-2 hidden sm:inline-block">{currentLanguage?.name}</span>
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
            {languages.map((language) => (
              <Menu.Item key={language.code}>
                {({ active }) => (
                  <button
                    className={`
                      ${active ? 'bg-gray-100' : ''}
                      ${i18n.language === language.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                      group flex items-center w-full px-4 py-2 text-sm
                    `}
                    onClick={() => changeLanguage(language.code)}
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                    {i18n.language === language.code && (
                      <span className="ml-auto">
                        <i className="fas fa-check text-primary-500"></i>
                      </span>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSelector;
