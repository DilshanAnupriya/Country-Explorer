import axios from 'axios';

const API_BASE_URL = 'https://restcountries.com/v3.1';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Get all countries
export const getAllCountries = async () => {
    try {
        const response = await api.get('/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all countries:', error);
        throw error;
    }
};

// Search countries by name
export const searchCountriesByName = async (name) => {
    try {
        const response = await api.get(`/name/${name}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching countries by name ${name}:`, error);
        // If name not found, return empty array instead of throwing error
        if (error.response && error.response.status === 404) {
            return [];
        }
        throw error;
    }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
    try {
        const response = await api.get(`/region/${region}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching countries by region ${region}:`, error);
        throw error;
    }
};

// Get country by code
export const getCountryByCode = async (code) => {
    try {
        const response = await api.get(`/alpha/${code}`);
        return response.data[0]; // API returns an array with one item
    } catch (error) {
        console.error(`Error fetching country by code ${code}:`, error);
        throw error;
    }
};

// Get countries by language
export const getCountriesByLanguage = async (languageCode) => {
    try {
        // Since the API doesn't directly support filtering by language,
        // we get all countries and filter them
        const allCountries = await getAllCountries();
        return allCountries.filter(country => {
            if (!country.languages) return false;
            return Object.values(country.languages).some(
                lang => lang.toLowerCase().includes(languageCode.toLowerCase())
            );
        });
    } catch (error) {
        console.error(`Error fetching countries by language ${languageCode}:`, error);
        throw error;
    }
};