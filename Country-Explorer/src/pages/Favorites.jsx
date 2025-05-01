import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CountryCard from '../components/CountryCard';

const Favorites = () => {
    const { favorites } = useAuth();

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Your Favorite Countries</h1>

            {favorites.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
                    <h2 className="text-xl font-medium text-gray-700 mb-4">
                        You don't have any favorite countries yet
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Start exploring and add countries to your favorites by clicking the star icon.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
                    >
                        Explore Countries
                    </Link>
                </div>
            ) : (
                <div>
                    <p className="mb-4 text-gray-600">
                        You have {favorites.length} {favorites.length === 1 ? 'country' : 'countries'} in your favorites.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {favorites.map(country => (
                            <CountryCard key={country.cca3} country={country} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;