import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Loader, Globe } from 'lucide-react';
import { getAllCountries } from '../services/api';
import CountryList from '../components/CountryList';

const LanguagePage = () => {
    const [countries, setCountries] = useState([]);
    const [allCountries, setAllCountries] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState([]);

    // Fetch all countries to extract languages
    useEffect(() => {
        const fetchAllCountries = async () => {
            try {
                setLoading(true);
                const data = await getAllCountries();
                setAllCountries(data);

                // Extract unique languages
                const languageMap = new Map();

                data.forEach(country => {
                    if (country.languages) {
                        Object.entries(country.languages).forEach(([code, name]) => {
                            const countryWithLanguage = {
                                code: country.cca3,
                                name: country.name.common,
                                flag: country.flags?.png || country.flags?.svg
                            };

                            if (languageMap.has(name)) {
                                languageMap.get(name).countries.push(countryWithLanguage);
                                languageMap.get(name).count += 1;
                            } else {
                                languageMap.set(name, {
                                    name,
                                    count: 1,
                                    countries: [countryWithLanguage]
                                });
                            }
                        });
                    }
                });

                const languageList = Array.from(languageMap.values())
                    .sort((a, b) => b.count - a.count);

                setLanguages(languageList);
                setFilteredLanguages(languageList);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch countries. Please try again later.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchAllCountries();
    }, []);

    // Handle language selection
    useEffect(() => {
        if (!selectedLanguage || !allCountries.length) return;

        setLoading(true);

        // Filter countries by the selected language
        const filteredCountries = allCountries.filter(country => {
            if (!country.languages) return false;
            return Object.values(country.languages).some(
                lang => lang === selectedLanguage
            );
        });

        setCountries(filteredCountries);
        setLoading(false);
    }, [selectedLanguage, allCountries]);

    // Handle search for languages
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredLanguages(languages);
            return;
        }

        const filtered = languages.filter(lang =>
            lang.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredLanguages(filtered);
    }, [searchTerm, languages]);

    // Handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const languageCardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: i => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.03,
                type: "spring",
                stiffness: 100
            }
        }),
        hover: {
            scale: 1.05,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
            <motion.div
                className="container mx-auto px-4 py-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Hero Section */}
                <motion.div
                    className="mb-12 text-center"
                    variants={itemVariants}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            delay: 0.2
                        }}
                        className="inline-block mb-4"
                    >
                        <MessageSquare size={64} className="text-purple-600 mx-auto" />
                    </motion.div>
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Explore by Language
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Discover countries around the world based on the languages they speak.
                    </motion.p>
                </motion.div>

                {/* Loading state */}
                {loading && !selectedLanguage && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <Loader size={36} className="text-purple-500" />
                        </motion.div>
                        <p className="mt-4 text-gray-600">Loading languages...</p>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-8">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Language Selection */}
                {!selectedLanguage && !loading && (
                    <>
                        {/* Search for languages */}
                        <motion.div
                            className="mb-8"
                            variants={itemVariants}
                        >
                            <div className="relative max-w-md mx-auto">
                                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for a language..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                                />
                            </div>
                        </motion.div>

                        {/* Language grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                        >
                            {filteredLanguages.map((language, index) => (
                                <motion.div
                                    key={language.name}
                                    custom={index}
                                    variants={languageCardVariants}
                                    whileHover="hover"
                                    onClick={() => setSelectedLanguage(language.name)}
                                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-800">{language.name}</h3>
                                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {language.count} {language.count === 1 ? 'country' : 'countries'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {language.countries.slice(0, Math.min(5, language.countries.length)).map((country) => (
                                                <div key={country.code} className="flex items-center bg-gray-100 rounded-full pl-1 pr-3 py-1">
                                                    <img
                                                        src={country.flag}
                                                        alt={`${country.name} flag`}
                                                        className="w-6 h-6 rounded-full mr-2 object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://via.placeholder.com/24x24?text=X";
                                                        }}
                                                    />
                                                    <span className="text-xs text-gray-800">{country.name}</span>
                                                </div>
                                            ))}
                                            {language.countries.length > 5 && (
                                                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                                    <span className="text-xs text-gray-800">+{language.countries.length - 5} more</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <div className="text-purple-600 text-sm font-medium flex items-center">
                                                View all countries
                                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {filteredLanguages.length === 0 && (
                            <motion.div
                                className="text-center py-12"
                                variants={itemVariants}
                            >
                                <Globe size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No languages found</h3>
                                <p className="text-gray-600 mb-6">Try a different search term</p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </>
                )}

                {/* Selected Language Display */}
                {selectedLanguage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">{selectedLanguage}</h2>
                                <p className="text-gray-600">
                                    {countries.length} {countries.length === 1 ? 'country' : 'countries'} speak this language
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLanguage('')}
                                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-lg shadow-sm transition-colors duration-300"
                            >
                                ← Back to Languages
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <Loader size={36} className="text-purple-500" />
                                </motion.div>
                                <p className="mt-4 text-gray-600">Loading countries that speak {selectedLanguage}...</p>
                            </div>
                        ) : (
                            <CountryList countries={countries} />
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default LanguagePage;