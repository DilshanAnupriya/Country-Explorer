import React from 'react';
import { motion } from 'framer-motion';
import { Loader, MapPin, RefreshCw } from 'lucide-react';
import CountryList from './CountryList';

const ResultsSection = ({ loading, error, filteredCountries, handleReset }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
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
    );
};

export default ResultsSection;
