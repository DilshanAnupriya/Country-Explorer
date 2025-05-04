import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

//api
import {
    getAllCountries,
    searchCountriesByName,
} from '../services/api';

// components
import HeroSection from '../components/HeroSection';
import SearchAndFilter from '../components/SearchAndFilter';
import ResultsSection from '../components/ResultsSection';
import HeroMain from '../components/HeroMain';

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

    return (
        <div className="min-h-screen ">
            <motion.div
                className="container mx-auto  mt-[-5px]"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                
                {/* Hero Section */}
                <HeroSection />

                {/* Search and Filter Section */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    selectedRegion={selectedRegion}
                    handleRegionChange={handleRegionChange}
                    selectedLanguage={selectedLanguage}
                    handleLanguageChange={handleLanguageChange}
                    handleReset={handleReset}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    regions={regions}
                    languages={languages}
                    filteredCountries={filteredCountries}
                />

                {/* Results Section */}
                <ResultsSection
                    loading={loading}
                    error={error}
                    filteredCountries={filteredCountries}
                    handleReset={handleReset}
                />
            </motion.div>
        </div>
    );
};

export default Home;