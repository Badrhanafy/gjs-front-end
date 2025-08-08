import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    User, Settings, LogOut, HelpCircle,
    CreditCard, Clock, ChevronRight, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../api'; // Make sure this is your configured axios instance

export default function AccountSidebar({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [isClosing, setIsClosing] = useState(false);
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch provider data when sidebar opens
    useEffect(() => {
        if (isOpen) {
            const fetchProvider = async () => {
                try {
                    const response = await api.get('/provider/profile');
                    setProvider(response.data);
                } catch (error) {
                    console.error('Error fetching provider data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProvider();
        }
    }, [isOpen]);


    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    };

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById('account-sidebar');
            if (isOpen && sidebar && !sidebar.contains(event.target)) {
                const userIcon = document.getElementById('user-icon');
                if (!userIcon || !userIcon.contains(event.target)) {
                    handleClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLogout = async () => {
        try {
            await api.post('/logout');

            // Clear local state
            logout();

            // Redirect to login
            navigate('/login');

        } catch (error) {
            console.error('Logout failed:', error);
            // Optionally show error to user
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'}`} />
            )}

            {/* Sidebar */}
            <div
                id="account-sidebar"
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isClosing ? 'translate-x-full' : ''}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {provider?.avatar ? (
                                <img
                                    src={provider.avatar}
                                    alt="Profile"
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-blue-600" />
                            )}
                        </div>
                        <div>
                            {loading ? (
                                <>
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-medium">
                                        {provider?.name || 'No name'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {provider?.phone || provider?.email || 'No contact info'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4">
                    <div className="space-y-1">
                        <Link
                            to="/account"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={handleClose}
                        >
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-gray-600" />
                                <span>{t('my_profile')}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>

                        <Link
                            to="/account/settings"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={handleClose}
                        >
                            <div className="flex items-center space-x-3">
                                <Settings className="h-5 w-5 text-gray-600" />
                                <span>{t('settings')}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>

                        <Link
                            to="/account/bookings"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={handleClose}
                        >
                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-gray-600" />
                                <span>{t('my_bookings')}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>

                        <Link
                            to="/account/payments"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={handleClose}
                        >
                            <div className="flex items-center space-x-3">
                                <CreditCard className="h-5 w-5 text-gray-600" />
                                <span>{t('payments')}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>

                        <Link
                            to="/help"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={handleClose}
                        >
                            <div className="flex items-center space-x-3">
                                <HelpCircle className="h-5 w-5 text-gray-600" />
                                <span>{t('help')}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-6 flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>{t('logout')}</span>
                    </button>
                </nav>
            </div>
        </>
    );
}