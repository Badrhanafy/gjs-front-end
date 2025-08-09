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
  const [showLoginTip, setShowLoginTip] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const searchInputRef = useRef(null);
  const accountButtonRef = useRef(null);
  const loginTipRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: 'https://flagcdn.com/w20/gb.png',
      country: 'United Kingdom'
    },
    { 
      code: 'fr', 
      name: 'Français', 
      flag: 'https://flagcdn.com/w20/fr.png',
      country: 'France'
    },
    { 
      code: 'ar', 
      name: 'العربية', 
      flag: 'https://flagcdn.com/w20/ma.png',
      country: 'Morocco'
    },
  ];

  // Get current language details
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginTipRef.current && !loginTipRef.current.contains(event.target)) {
        if (accountButtonRef.current && !accountButtonRef.current.contains(event.target)) {
          setShowLoginTip(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    setIsLanguageOpen(false);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleAccountClick = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAccountOpen(true);
      setShowLoginTip(false);
    } else {
      setShowLoginTip(true);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }
  };

  const handleAccountHover = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsHovering(true);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setShowLoginTip(true);
    }
  };

  const handleAccountLeave = () => {
    setIsHovering(false);
    if (!loginTipRef.current?.matches(':hover')) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isHovering) {
          setShowLoginTip(false);
        }
      }, 300);
    }
  };

  const handleTipHover = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleTipLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowLoginTip(false);
    }, 300);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo on the left */}
            <Link to="/" className="text-xl font-bold text-blue-600">
              <div className="flex items-center">
                <img src="Dari Company.png" alt="" srcSet="" width={'120px'} height={"40px"} />
                <span className="ml-2 text-lg font-semibold hidden md:block">Find Trusted Professionals</span>
              </div>
            </Link>
            
            {/* Desktop Navigation - Centered links */}
            {!isMobile && (
              <div className="flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
                <Link 
                  to="/" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 group transition-all duration-200"
                >
                  <Home className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{t('home')}</span>
                </Link>
                <Link 
                  to="/services" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 group transition-all duration-200"
                >
                  <Briefcase className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Browse Services</span>
                </Link>
                <Link 
                  to="/bookings" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 group transition-all duration-200"
                >
                  <Calendar className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{t('bookings')}</span>
                </Link>
              </div>
            )}
            
            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Search button - Only on mobile */}
              {isMobile && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1 text-gray-700 hover:text-blue-600 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6" />
                </button>
              )}

              {/* Language dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
                >
                  <div className="flex items-center">
                    <img 
                      src={currentLang.flag} 
                      alt={currentLang.country} 
                      className="w-5 h-3.5 rounded-sm mr-2"
                    />
                    <span className="text-sm hidden sm:inline">{currentLang.code.toUpperCase()}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors ${currentLanguage === lang.code ? 'bg-blue-100 font-medium' : ''}`}
                      >
                        <img 
                          src={lang.flag} 
                          alt={lang.country} 
                          className="w-5 h-3.5 rounded-sm mr-3"
                        />
                        <div className="text-left">
                          <div>{lang.name}</div>
                          <div className="text-xs text-gray-500">{lang.country}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* User account */}
              <div className="relative">
                <button 
                  ref={accountButtonRef}
                  onClick={handleAccountClick}
                  onMouseEnter={handleAccountHover}
                  onMouseLeave={handleAccountLeave}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                  title={t('account')}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                </button>

                {showLoginTip && (
                  <div 
                    ref={loginTipRef}
                    onMouseEnter={handleTipHover}
                    onMouseLeave={handleTipLeave}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 px-3 z-50 border border-gray-100"
                    style={{
                      animation: 'fadeInUp 0.2s ease-out forwards',
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {t('login_required')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('login_to_access_account')}
                        </p>
                        <div className="mt-2">
                          <Link
                            to="/login"
                            onClick={() => setShowLoginTip(false)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            {t('sign_in')} &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-1 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
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

          {/* Mobile Menu */}
          {isMobile && isMobileMenuOpen && (
            <div className="mt-4 pb-4 border-t pt-4 animate-fade-in">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5 mr-3" />
                  {t('home')}
                </Link>
                <Link 
                  to="/services" 
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  Browse Services
                </Link>
                <Link 
                  to="/bookings" 
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
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
                        className={`flex items-center px-3 py-2 rounded-md text-left transition-colors ${currentLanguage === lang.code ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                      >
                        <img 
                          src={lang.flag} 
                          alt={lang.country} 
                          className="w-5 h-3.5 rounded-sm mr-2"
                        />
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
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSearchOpen(false)}
          />
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
            <div className="relative bg-white rounded-lg shadow-xl p-4 animate-fade-in">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 transition-colors"
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
                  className="flex-1 py-2 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none transition-colors"
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}