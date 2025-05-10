import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from "../hooks/useAuth.js";

const CountryCard = ({ country }) => {

    const { currentUser, addFavorite, removeFavorite, isFavorite } = useAuth();
    const isCountryFavorite = country?.cca3 && isFavorite(country.cca3);
    const [isHovered, setIsHovered] = useState(false);

    // Format population with commas
    const formatPopulation = (population) => {
        return population ? population.toLocaleString() : 'N/A';
    };

    // Get languages as a comma-separated string
    const getLanguages = (languages) => {
        if (!languages) return 'N/A';
        return Object.values(languages).join(', ');
    };

    const handleFavoriteToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCountryFavorite) {
            removeFavorite(country.cca3);
        } else {
            addFavorite(country);
        }
    };

    return (
        <Link
            to={`/country/${country.cca3}`}
            className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all
            duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Flag with overlay on hover */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={country.flags?.png || country.flags?.svg}
                    alt={`Flag of ${country.name.common}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x200?text=Flag+Not+Available";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0
                group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Country name overlay on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full
                group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white">
                        {country.name.common}
                    </h3>
                </div>
            </div>

            {/* Content section */}
            <div className="p-5 border-t border-gray-100">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600
                    transition-colors duration-300">
                        {country.name.common}
                    </h3>
                    {currentUser && (
                        <button
                            onClick={handleFavoriteToggle}
                            className={`transform transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
                            aria-label={isCountryFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <svg
                                className={`w-6 h-6 ${isCountryFavorite ? 'text-yellow-500 fill-current' : 
                                    'text-gray-400 hover:text-yellow-400'} transition-colors duration-300`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill={isCountryFavorite ? 'currentColor' : 'none'}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969
                                     0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755
                                     1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-
                                     .197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.
                                     81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <span className="w-24 font-medium text-gray-500">Capital:</span>
                        <span className="text-gray-700">{country.capital?.[0] || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="w-24 font-medium text-gray-500">Region:</span>
                        <span className="text-gray-700">{country.region || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="w-24 font-medium text-gray-500">Population:</span>
                        <span className="text-gray-700">{formatPopulation(country.population)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="w-24 font-medium text-gray-500">Languages:</span>
                        <span className="text-gray-700 truncate">{getLanguages(country.languages)}</span>
                    </div>
                </div>

                {/* View details button that appears on hover */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="inline-flex items-center text-blue-600 font-medium">
                        View details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Corner ribbon for special styling */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-blue-600 transform rotate-45 translate-x-8 -translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
    );
};

export default CountryCard;