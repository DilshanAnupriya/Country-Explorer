import React, { useState } from 'react';
import { Globe, Map, MessageSquare, Star, LogIn, LogOut, Menu, X, User } from 'lucide-react';

// Mocked Link and useLocation instead of importing from react-router-dom
const Link = ({ to, className, children, onClick }) => (
    <a href={to} className={className} onClick={onClick}>
        {children}
    </a>
);

// Mock useAuth hook
const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const login = () => setCurrentUser({ name: "User Name", email: "user@example.com" });
    const logout = () => setCurrentUser(null);
    return { currentUser, login, logout };
};

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Mock implementation of useLocation
    const location = { pathname: window.location.pathname };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    // Check if a link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Navigation links with their icons
    const navLinks = [
        { path: '/', label: 'Home', icon: <Globe size={18} /> },
        { path: '/region', label: 'Regions', icon: <Map size={18} /> },
        { path: '/language', label: 'Languages', icon: <MessageSquare size={18} /> },
        { path: '/favorites', label: 'Favorites', icon: <Star size={18} />, requiresAuth: true }
    ];

    return (
        <nav className="bg-white text-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="transform motion-safe:hover:scale-110 transition-transform duration-300">
                                <Globe className="h-8 w-8 text-blue-600" />
                            </div>
                            <span className="ml-2 text-xl font-bold text-blue-600">TravelLingo</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks.map((link, index) => (
                            (!link.requiresAuth || (link.requiresAuth && currentUser)) && (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        isActive(link.path)
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="mr-1.5">{link.icon}</span>
                                    {link.label}
                                </Link>
                            )
                        ))}

                        {/* Authentication Buttons */}
                        <div className="flex items-center ml-4">
                            {currentUser ? (
                                <div className="flex items-center space-x-3">
                                    <div className="relative group">
                                        <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                                            <User size={18} className="mr-1.5 text-blue-600" />
                                            <span>Profile</span>
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Your Profile
                                            </Link>
                                            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Settings
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <div className="flex items-center">
                                                    <LogOut size={16} className="mr-1.5" />
                                                    Sign Out
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                                    >
                                        <LogIn size={16} className="mr-1.5" />
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                            aria-expanded="false"
                        >
                            <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link, index) => (
                        (!link.requiresAuth || (link.requiresAuth && currentUser)) && (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                                    isActive(link.path)
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                } transition-colors duration-200`}
                            >
                                <span className="mr-2">{link.icon}</span>
                                {link.label}
                            </Link>
                        )
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    {currentUser ? (
                        <div className="px-2 space-y-1">
                            <div className="flex items-center px-4 mb-3">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{currentUser.name || 'User'}</div>
                                    <div className="text-sm font-medium text-gray-500">{currentUser.email || 'user@example.com'}</div>
                                </div>
                            </div>
                            <Link
                                to="/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Your Profile
                            </Link>
                            <Link
                                to="/settings"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Settings
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="flex items-center">
                                    <LogOut size={16} className="mr-2" />
                                    Sign Out
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="px-5 py-3 flex flex-col space-y-2">
                            <Link
                                to="/login"
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                            >
                                <LogIn size={16} className="mr-1.5" />
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;