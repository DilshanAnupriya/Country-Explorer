import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw } from 'lucide-react';

const SearchAndFilter = ({
                             searchTerm,
                             handleSearch,
                             selectedRegion,
                             handleRegionChange,
                             selectedLanguage,
                             handleLanguageChange,
                             handleReset,
                             isFilterOpen,
                             setIsFilterOpen,
                             regions,
                             languages,
                             filteredCountries
                         }) => {
    // Animation variants
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
        <motion.div
            className="mb-8 bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
                                <button onClick={() => handleSearch('')} className="ml-1 text-blue-500 hover:text-blue-700">
                                    &times;
                                </button>
                            </span>
                        )}
                        {selectedRegion && (
                            <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                Region: {selectedRegion}
                                <button onClick={() => handleRegionChange('')} className="ml-1 text-indigo-500 hover:text-indigo-700">
                                    &times;
                                </button>
                            </span>
                        )}
                        {selectedLanguage && (
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                Language: {selectedLanguage}
                                <button onClick={() => handleLanguageChange('')} className="ml-1 text-purple-500 hover:text-purple-700">
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
    );
};

export default SearchAndFilter;