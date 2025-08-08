import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Briefcase, Calendar, User, 
  ChevronDown, Globe, Menu, X, Search 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AccountSidebar from './AccountSidebar';

export default function Header() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const searchInputRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    setIsLanguageOpen(false);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo on the left */}
            <Link to="/" className="text-xl font-bold text-blue-600">
              <img src="Dari Company.png" alt="" srcset="" width={'100vh'} height={"5vh"} />
            </Link>
            
            {/* Desktop Navigation - Centered links */}
            {!isMobile && (
              <div className="flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
                <Link 
                  to="/" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 group"
                >
                  <Home className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">{t('home')}</span>
                </Link>
                <Link 
                  to="/services" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 group"
                >
                  <Briefcase className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">{t('services')}</span>
                </Link>
                <Link 
                  to="/bookings" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 group"
                >
                  <Calendar className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">{t('bookings')}</span>
                </Link>
              </div>
            )}
            
            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Search button - Only on mobile */}
              {isMobile && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1 text-gray-700 hover:text-blue-600"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6" />
                </button>
              )}

              {/* Language dropdown - Hidden on mobile */}
              {!isMobile && (
                <div className="relative">
                  <button 
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 focus:outline-none"
                  >
                    <Globe className="h-5 w-5" />
                    <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 ${currentLanguage === lang.code ? 'bg-blue-100' : ''}`}
                        >
                          <span className="text-lg mr-2">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* User account - Always visible */}
              <button 
                id="user-icon"
                onClick={() => setIsAccountOpen(true)}
                className="flex items-center text-gray-700 hover:text-blue-600"
                title={t('account')}
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-blue-100 transition-colors">
                  <User className="h-5 w-5" />
                </div>
              </button>

              {/* Mobile menu button - Only on mobile */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-1 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Menu - Only shows on mobile */}
          {isMobile && isMobileMenuOpen && (
            <div className="mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5 mr-3" />
                  {t('home')}
                </Link>
                <Link 
                  to="/services" 
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  {t('services')}
                </Link>
                <Link 
                  to="/bookings" 
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  {t('bookings')}
                </Link>

                {/* Language selector for mobile */}
                <div className="px-3 py-2">
                  <div className="font-medium text-gray-500 mb-2 flex items-center">
                    <Globe className="h-5 w-5 mr-3" />
                    {t('language')}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center px-3 py-2 rounded-md text-left ${currentLanguage === lang.code ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                      >
                        <span className="text-lg mr-2">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isMobile && isSearchOpen && (
        <div className="fixed inset-0 z-50">
          {/* Blur overlay */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSearchOpen(false)}
          />
          
          {/* Search container */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
            <div className="relative bg-white rounded-lg shadow-xl p-4 animate-fade-in">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
              
              <form onSubmit={handleSearch} className="flex items-center">
                <Search className="h-5 w-5 text-gray-500 mr-3" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-2 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none"
                />
                <button
                  type="submit"
                  className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('search')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Account Sidebar */}
      <AccountSidebar isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      {/* Add this to your CSS or Tailwind config for the animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}