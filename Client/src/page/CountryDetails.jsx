import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCode } from '../services/api';
import useAuth from '../hooks/useAuth';

const CountryDetails = () => {
    const { code } = useParams();
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const { currentUser, addFavorite, removeFavorite, isFavorite } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                setLoading(true);
                const data = await getCountryByCode(code);
                setCountry(data);
                // Delay to ensure smooth animation
                setTimeout(() => setIsVisible(true), 100);
            } catch (err) {
                setError('Failed to fetch country details. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountry();
    }, [code]);

    const isCountryFavorite = country?.cca3 && isFavorite(country.cca3);

    const handleFavoriteToggle = () => {
        if (isCountryFavorite) {
            removeFavorite(country.cca3);
        } else {
            addFavorite(country);
        }
    };

    // Format population with commas
    const formatPopulation = (population) => {
        return population ? population.toLocaleString() : 'N/A';
    };

    // Get languages as a comma-separated string
    const getLanguages = (languages) => {
        if (!languages) return 'N/A';
        return Object.values(languages).join(', ');
    };

    // Get currencies as a formatted string
    const getCurrencies = (currencies) => {
        if (!currencies) return 'N/A';
        return Object.values(currencies)
            .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
            .join(', ');
    };

    // Get border countries
    const getBorderCountries = (borders) => {
        if (!borders || borders.length === 0) return 'None';
        return (
            <div className="flex flex-wrap gap-2">
                {borders.map(border => (
                    <Link
                        key={border}
                        to={`/country/${border}`}
                        className="bg-white px-4 py-2 text-sm shadow-md rounded-lg hover:shadow-lg transition-all duration-300
                                 text-gray-700 hover:text-blue-600 transform hover:scale-105 border border-gray-200"
                    >
                        {border}
                    </Link>
                ))}
            </div>
        );
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'details', label: 'Details' },
        { id: 'maps', label: 'Maps' },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="relative w-24 h-24" role="status" aria-label="Loading"> {/* Add role="status" */}
                    <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`max-w-lg mx-auto mt-12 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg overflow-hidden 
                          transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800">Error</h3>
                    </div>
                    <p className="text-red-700 mb-4">{error}</p>
                    <Link to="/" className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transform hover:scale-105 transition-all duration-300">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!country) {
        return (
            <div className={`text-center py-24 max-w-2xl mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-2xl text-gray-600 mb-6">Country not found.</p>
                <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-6xl mx-auto">
                <div className={`mb-8  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <Link to="/" className="group flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 transform hover:translate-x-1">
                        <svg className="w-5 h-5 mr-2 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        <span className="font-medium">Back to Countries</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className={`md:flex transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="md:w-2/5 relative overflow-hidden group">
                            <img
                                src={country.flags?.png || country.flags?.svg}
                                alt={`Flag of ${country.name.common}`}
                                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/600x400?text=Flag+Not+Available";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="p-8 md:w-3/5">
                            <div className="flex justify-between items-start mb-6">
                                <h1 className={`text-4xl font-bold text-gray-800 transition-all duration-500 delay-100 
                                             ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    {country.name.common}
                                </h1>

                                {currentUser && (
                                       <button
                                       onClick={handleFavoriteToggle}
                                       className={`p-3 rounded-full shadow-md transition-all duration-500 
                                           ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                                           ${isCountryFavorite 
                                               ? 'bg-yellow-100 hover:bg-yellow-200 animate-bounce-once' 
                                               : 'bg-gray-100 hover:bg-gray-200'}`}
                                       aria-label={isCountryFavorite ? "Remove from favorites" : "Add to favorites"}
                                   >
                                       <svg
                                           className={`w-6 h-6 transition-all duration-300 transform
                                               ${isCountryFavorite 
                                                   ? 'text-yellow-500 fill-current scale-110' 
                                                   : 'text-gray-400 hover:scale-110'}`}
                                           xmlns="http://www.w3.org/2000/svg"
                                           viewBox="0 0 24 24"
                                           stroke="currentColor"
                                           strokeWidth="2"
                                           fill={isCountryFavorite ? 'currentColor' : 'none'}
                                       >
                                           <path
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                               d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                           />
                                       </svg>
                                   </button>
                                )}
                            </div>

                            {country.name.nativeName && (
                                <p className={`text-gray-600 mb-8 text-lg transition-all duration-500 delay-200 
                                            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    Native name: <span className="font-medium">{Object.values(country.name.nativeName)[0]?.common || 'N/A'}</span>
                                </p>
                            )}

                            <div className={`flex space-x-1 mb-8 border-b border-gray-200 transition-all duration-500 delay-300 
                                          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-3 font-medium transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 animate-fadeIn">
                                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 transform hover:scale-102">
                                        <div className="mr-3 p-2 bg-blue-100 rounded-full text-blue-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Population</p>
                                            <p className="font-semibold">{formatPopulation(country.population)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 transform hover:scale-102">
                                        <div className="mr-3 p-2 bg-green-100 rounded-full text-green-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Region</p>
                                            <p className="font-semibold">{country.region || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 transform hover:scale-102">
                                        <div className="mr-3 p-2 bg-purple-100 rounded-full text-purple-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Capital</p>
                                            <p className="font-semibold">{country.capital?.[0] || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 transform hover:scale-102">
                                        <div className="mr-3 p-2 bg-yellow-100 rounded-full text-yellow-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Currencies</p>
                                            <p className="font-semibold truncate max-w-xs">{getCurrencies(country.currencies)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="rounded-lg bg-gray-50 p-4 hover:shadow-md transition-shadow duration-300 hover:bg-gray-100">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Region:</span> {country.region || 'N/A'}
                                        </p>
                                        <p className="text-gray-700 mt-2">
                                            <span className="font-semibold">Sub-region:</span> {country.subregion || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4 hover:shadow-md transition-shadow duration-300 hover:bg-gray-100">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Top Level Domain:</span> {country.tld?.join(', ') || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4 hover:shadow-md transition-shadow duration-300 hover:bg-gray-100">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Languages:</span> {getLanguages(country.languages)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4 hover:shadow-md transition-shadow duration-300 hover:bg-gray-100">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Area:</span> {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'maps' && (
                                <div className="space-y-6 animate-fadeIn">
                                    {country.maps?.googleMaps ? (
                                        <div className="space-y-4">
                                            <p className="text-gray-700">View this country on external map services:</p>
                                            <div className="flex flex-wrap gap-4">
                                                <a
                                                    href={country.maps.googleMaps}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow transition-all duration-300 transform hover:scale-105"
                                                >
                                                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                    </svg>
                                                    Google Maps
                                                </a>

                                                {country.maps.openStreetMaps && (
                                                    <a
                                                        href={country.maps.openStreetMaps}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg shadow transition-all duration-300 transform hover:scale-105"
                                                    >
                                                        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                        </svg>
                                                        OpenStreetMaps
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                            </svg>
                                            <p className="text-gray-500">No map information available</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`p-8 border-t border-gray-100 transition-all duration-700 delay-500 
                                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Border Countries</h2>
                        {getBorderCountries(country.borders)}
                    </div>
                </div>
            </div>

            {/*  animations */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes bounceOnce {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.5s ease-in-out;
                    }
                    .animate-bounce-once {
                        animation: bounceOnce 0.5s ease-in-out;
                    }
                    .hover\\:scale-102:hover {
                        transform: scale(1.02);
                    }
                `}
            </style>
        </div>
    );
};

export default CountryDetails;