import React, { useState, useEffect, useRef } from 'react';
import { Globe, Map, MessageSquare, Star, LogIn, LogOut, Menu, X, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Link = ({ to, className, children, onClick }) => (
    <a href={to} className={className} onClick={onClick}>
        {children}
    </a>
);

const Navbar = () => {
    const { currentUser, logout, authChecked } = useAuth(); // Include authChecked
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isAuthenticated = !!currentUser;
    console.log(isAuthenticated);

    const location = { pathname: window.location.pathname };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setDropdownOpen(false);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home', icon: <Globe size={18} /> },
        { path: '/region', label: 'Regions', icon: <Map size={18} /> },
        { path: '/language', label: 'Languages', icon: <MessageSquare size={18} /> },
        { path: '/favorites', label: 'Favorites', icon: <Star size={18} />, requiresAuth: true }
    ];

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Wait until authChecked is true before rendering
    if (!authChecked) {
        return null; // Or a loading spinner if you prefer
    }

    return (
        <nav className="bg-white text-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="transform motion-safe:hover:scale-110 transition-transform duration-300">
                                <Globe className="h-8 w-8 text-blue-600" />
                            </div>
                            <span className="ml-2 text-xl font-bold text-blue-600">Country Explorer</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks.map((link) => (
                            (!link.requiresAuth || isAuthenticated) && (
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

                        <div className="flex items-center ml-4" ref={dropdownRef}>
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                                    >
                                        <User size={18} className="mr-1.5 text-blue-600" />
                                        <span>{currentUser?.username || 'Profile'}</span>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                            
                                            {/* Fixed Desktop Sign Out Button */}
                                            <button
                                                onClick={() => {
                                                    closeDropdown();
                                                    handleLogout();
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <div className="flex items-center">
                                                    <LogOut size={16} className="mr-1.5" />
                                                    Sign Out
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <Link to="/login" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200">
                                        <LogIn size={16} className="mr-1.5" />
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                        >
                            <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                            {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                        (!link.requiresAuth || isAuthenticated) && (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                                    isActive(link.path)
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                } transition-colors duration-200`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="mr-2">{link.icon}</span>
                                {link.label}
                            </Link>
                        )
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    {isAuthenticated ? (
                        <div className="px-2 space-y-1">
                            <div className="flex items-center px-4 mb-3">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                    {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{currentUser?.username || 'User'}</div>
                                    <div className="text-sm font-medium text-gray-500">{currentUser?.email || 'user@example.com'}</div>
                                </div>
                            </div>
                            <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                Your Profile
                            </Link>
                            <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                Settings
                            </Link>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
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
                            <Link to="/login" className="w-full flex justify-center items-center px-4 py-2 text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                <LogIn size={16} className="mr-1.5" />
                                Sign In
                            </Link>
                            <Link to="/signup" className="w-full flex justify-center items-center px-4 py-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
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