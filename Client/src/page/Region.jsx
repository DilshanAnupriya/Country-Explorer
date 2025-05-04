import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Loader, Map } from 'lucide-react';
import { getCountriesByRegion, getAllCountries } from '../services/api';
import CountryList from '../components/CountryList';

const RegionPage = () => {
    const [countries, setCountries] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all countries to extract regions
    useEffect(() => {
        const fetchAllCountries = async () => {
            try {
                setLoading(true);
                const data = await getAllCountries();
                // Extract unique regions
                const uniqueRegions = [...new Set(data.map(country => country.region).filter(Boolean))];
                setRegions(uniqueRegions.sort());
                setCountries(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch countries. Please try again later.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchAllCountries();
    }, []);

    // Fetch countries by region when selected
    useEffect(() => {
        const fetchCountriesByRegion = async () => {
            if (!selectedRegion) return;

            try {
                setLoading(true);
                // Filter by region from existing countries data
                const filteredCountries = countries.filter(country => country.region === selectedRegion);
                setCountries(filteredCountries);
            } catch (err) {
                setError(`Failed to fetch countries for ${selectedRegion}. Please try again.`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedRegion) {
            fetchCountriesByRegion();
        }
    }, [selectedRegion]);

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

    const regionCardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: i => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.05,
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

    // Get region data with count and exemplar countries
    const getRegionData = () => {
        return regions.map(region => {
            const regionCountries = countries.filter(country => country.region === region);
            return {
                name: region,
                count: regionCountries.length,
                exemplarCountries: regionCountries.slice(0, 3).map(c => c.name.common)
            };
        });
    };

    const regionData = getRegionData();

    // Mapping of regions to colors and icons
    const regionStyles = {
        'Africa': {
            gradient: 'from-yellow-400 to-orange-500',
            imgUrl: 'https://i.ytimg.com/vi/lugard7P0nw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBcg2dCtp-gacMzKOPlyDahAFUmcA',
            bgClass: 'bg-yellow-100'
        },
        'Americas': {
            gradient: 'from-red-400 to-red-600',
            imgUrl: 'https://www.celebritycruises.com/blog/content/uploads/2020/09/landmarks-in-south-america-christ-the-redeemer-brazil-1024x767.jpg',
            bgClass: 'bg-red-100'
        },
        'Asia': {
            gradient: 'from-green-400 to-emerald-600',
            imgUrl: 'https://www.jonesaroundtheworld.com/wp-content/uploads/2021/09/Sigiriya-Rock-Fortress-Sri-Lanka.jpg',
            bgClass: 'bg-green-100'
        },
        'Europe': {
            gradient: 'from-blue-400 to-indigo-600',
            imgUrl: 'https://www.visiteurope.com/wp-content/uploads/fr-shutterstock-77676271-hd-s.jpeg',
            bgClass: 'bg-blue-100'
        },
        'Oceania': {
            gradient: 'from-purple-400 to-purple-600',
            imgUrl: 'https://sevenwonders.org/wp-content/uploads/2018/03/Sydney-Opera-House.jpg',
            bgClass: 'bg-purple-100'
        },
        'Antarctic': {
            gradient: 'from-cyan-400 to-blue-500',
            imgUrl: 'https://blog.dookinternational.com/wp-content/uploads/2021/09/LeMaire-Channel.jpg',
            bgClass: 'bg-cyan-100'
        },
        'Polar': {
            gradient: 'from-cyan-400 to-blue-500',
            imgUrl: 'https://www.treehugger.com/thmb/HDyD0isps4b6qL74bNlT4ZLcD0c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1192975558-e9b305ee5d7143babc3014b11a5935a8.jpg',
            bgClass: 'bg-cyan-100'
        }
    };

    // Get default style for regions not in the mapping
    const getRegionStyle = (region) => {
        return regionStyles[region] || {
            gradient: 'from-gray-400 to-gray-600',
            icon: '🌐',
            bgClass: 'bg-gray-100'
        };
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
                        <Map size={64} className="text-blue-600 mx-auto" />
                    </motion.div>
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Explore by Region
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Discover countries across different geographical regions of the world.
                    </motion.p>
                </motion.div>

                {/* Loading state */}
                {loading && !selectedRegion && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <Loader size={36} className="text-blue-500" />
                        </motion.div>
                        <p className="mt-4 text-gray-600">Loading regions...</p>
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

                {/* Region Selection */}
                {!selectedRegion && !loading && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                    >
                        {regionData.map((region, index) => (
                            <motion.div
                                key={region.name}
                                custom={index}
                                variants={regionCardVariants}
                                whileHover="hover"
                                onClick={() => setSelectedRegion(region.name)}
                                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                            >
                                <div
                                    className="h-50 flex items-center justify-center text-white bg-cover bg-center rounded-x-2xl"
                                    style={{
                                        backgroundImage: `url(${getRegionStyle(region.name).imgUrl})`,
                                    }}
                                >
                                    <span className="text-4xl font-bold drop-shadow-lg ">
                                        
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{region.name}</h3>
                                    <p className="text-gray-600 mb-4 text-sm">{region.count} countries</p>
                                    <div className="flex flex-wrap gap-2">
                                        {region.exemplarCountries.map((country, i) => (
                                            <span
                                                key={country}
                                                className={`text-xs px-2 py-1 rounded-full ${getRegionStyle(region.name).bgClass} text-gray-800`}
                                            >
                                                {country}
                                            </span>
                                        ))}
                                        {region.count > 3 && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                                +{region.count - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Selected Region Display */}
                {selectedRegion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-4xl mr-4">{getRegionStyle(selectedRegion).icon}</span>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">{selectedRegion}</h2>
                                    <p className="text-gray-600">
                                        {countries.length} {countries.length === 1 ? 'country' : 'countries'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRegion('')}
                                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-lg shadow-sm transition-colors duration-300"
                            >
                                ← Back to Regions
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <Loader size={36} className="text-blue-500" />
                                </motion.div>
                                <p className="mt-4 text-gray-600">Loading countries in {selectedRegion}...</p>
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

export default RegionPage;