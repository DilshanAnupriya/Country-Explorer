import React, { useState, useEffect } from 'react';
import CountryCard from './CountryCard';
import { motion } from 'framer-motion';

const LetterNav = ({ letters, activeLetter, onLetterClick }) => {
    return (
        <div className="sticky top-0 z-10 bg-white py-4 shadow-md rounded-lg mb-6">
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto px-4">
                {letters.map((letter) => (
                    <motion.button
                        key={letter}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onLetterClick(letter)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                            activeLetter === letter
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {letter}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

const CountrySection = ({ letter, countries }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
        >
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-3 text-blue-700">
                {letter}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {countries.map((country) => (
                    <motion.div
                        key={country.cca3}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <CountryCard country={country} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const CountryList = ({ countries }) => {
    const [activeLetter, setActiveLetter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const countriesPerPage = 12;

    // Group countries by first letter
    const groupedCountries = countries.reduce((acc, country) => {
        const firstLetter = country.name.common.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(country);
        return acc;
    }, {});

    // Sort letters alphabetically
    const sortedLetters = Object.keys(groupedCountries).sort();

    useEffect(() => {
        // Set the first letter as active by default
        if (sortedLetters.length > 0 && !activeLetter) {
            setActiveLetter(sortedLetters[0]);
        }
    }, [sortedLetters, activeLetter]);

    // Handle letter click
    const handleLetterClick = (letter) => {
        setActiveLetter(letter);
        setCurrentPage(1); // Reset to first page when changing letter
    };

    // Get current countries
    const currentCountries = activeLetter ? groupedCountries[activeLetter] || [] : [];
    const indexOfLastCountry = currentPage * countriesPerPage;
    const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
    const currentCountriesOnPage = currentCountries.slice(indexOfFirstCountry, indexOfLastCountry);

    // Calculate total pages
    const totalPages = Math.ceil(currentCountries.length / countriesPerPage);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <LetterNav
                letters={sortedLetters}
                activeLetter={activeLetter}
                onLetterClick={handleLetterClick}
            />

            {activeLetter && (
                <>
                    <CountrySection letter={activeLetter} countries={currentCountriesOnPage} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10 gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === 1
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        className={`w-10 h-10 rounded-md ${
                                            currentPage === number
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CountryList;