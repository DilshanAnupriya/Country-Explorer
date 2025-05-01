import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, MapPin, Filter, RefreshCw, Loader } from 'lucide-react';
import {
    getAllCountries,
    searchCountriesByName,
    getCountriesByRegion,
    getCountriesByLanguage
} from '../services/api';
import CountryList from '../components/CountryList';
import SearchBar from '../components/SearchBar';
import FilterOptions from '../components/FilterOptions';

const Home = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Extract unique regions and languages for filter dropdowns
    const regions = [...new Set(countries.map(country => country.region).filter(Boolean))];

    const languages = countries.reduce((acc, country) => {
        if (country.languages) {
            Object.values(country.languages).forEach(lang => {
                if (!acc.includes(lang)) {
                    acc.push(lang);
                }
            });
        }
        return acc;
    }, []).sort();

    // Fetch all countries on initial load
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                const data = await getAllCountries();
                setCountries(data);
                setFilteredCountries(data);
            } catch (err) {
                setError('Failed to fetch countries. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    // Handle search and filter
    useEffect(() => {
        const applyFilters = async () => {
            setLoading(true);
            try {
                let result = countries;

                // Apply search if provided
                if (searchTerm) {
                    result = await searchCountriesByName(searchTerm);
                }

                // Apply region filter if selected
                if (selectedRegion && result.length > 0) {
                    result = result.filter(country => country.region === selectedRegion);
                }

                // Apply language filter if selected
                if (selectedLanguage && result.length > 0) {
                    result = result.filter(country => {
                        if (!country.languages) return false;
                        return Object.values(country.languages).some(
                            lang => lang === selectedLanguage
                        );
                    });
                }

                setFilteredCountries(result);
            } catch (err) {
                setError('Error applying filters. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Only run filter if we have countries loaded
        if (countries.length > 0) {
            applyFilters();
        }
    }, [searchTerm, selectedRegion, selectedLanguage, countries]);

    // Handle search input change
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // Handle region filter change
    const handleRegionChange = (region) => {
        setSelectedRegion(region);
    };

    // Handle language filter change
    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };

    // Reset all filters
    const handleReset = () => {
        setSearchTerm('');
        setSelectedRegion('');
        setSelectedLanguage('');
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

    const filterVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
                        <Globe size={64} className="text-blue-600 mx-auto" />
                    </motion.div>
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Explore Our World
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Discover detailed information about countries, their cultures, languages, and more.
                    </motion.p>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    className="mb-8 bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
                    variants={itemVariants}
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for a country..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <motion.button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors duration-300"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Filter size={18} />
                            <span className="font-medium">Filters</span>
                            <motion.span
                                animate={{ rotate: isFilterOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </motion.span>
                        </motion.button>

                        {(searchTerm || selectedRegion || selectedLanguage) && (
                            <motion.button
                                onClick={handleReset}
                                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-3 rounded-lg transition-colors duration-300"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <RefreshCw size={18} />
                                <span className="font-medium">Reset</span>
                            </motion.button>
                        )}
                    </div>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                variants={filterVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                                    <select
                                        value={selectedRegion}
                                        onChange={(e) => handleRegionChange(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                    >
                                        <option value="">All Regions</option>
                                        {regions.map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                    >
                                        <option value="">All Languages</option>
                                        {languages.map((language) => (
                                            <option key={language} value={language}>
                                                {language}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Filter stats */}
                    {(searchTerm || selectedRegion || selectedLanguage) && (
                        <motion.div
                            className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-sm text-gray-600">
                                <span className="font-semibold text-blue-600">{filteredCountries.length}</span> {filteredCountries.length === 1 ? 'country' : 'countries'} found
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        Search: {searchTerm}
                                        <button onClick={() => setSearchTerm('')} className="ml-1 text-blue-500 hover:text-blue-700">
                                            &times;
                                        </button>
                                    </span>
                                )}
                                {selectedRegion && (
                                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                        Region: {selectedRegion}
                                        <button onClick={() => setSelectedRegion('')} className="ml-1 text-indigo-500 hover:text-indigo-700">
                                            &times;
                                        </button>
                                    </span>
                                )}
                                {selectedLanguage && (
                                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                        Language: {selectedLanguage}
                                        <button onClick={() => setSelectedLanguage('')} className="ml-1 text-purple-500 hover:text-purple-700">
                                            &times;
                                        </button>
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </motion.div>

                {/* Results Section */}
                <motion.div variants={itemVariants}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Loader size={36} className="text-blue-500" />
                            </motion.div>
                            <p className="mt-4 text-gray-600">Loading countries...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : filteredCountries.length === 0 ? (
                        <motion.div
                            className="bg-white rounded-xl shadow-lg p-8 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No countries found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
                            <motion.button
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RefreshCw size={18} />
                                Reset All Filters
                            </motion.button>
                        </motion.div>
                    ) : (
                        <CountryList countries={filteredCountries} />
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;