import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    // Check if user is logged in on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedFavorites = localStorage.getItem('favorites');

        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }

        setLoading(false);
    }, []);

    // Login function
    const login = (email, password) => {
        // For demo purposes, we're just using simple validation
        // In a real app, you would connect to a backend service
        if (email && password) {
            const user = { email, name: email.split('@')[0] };
            localStorage.setItem('user', JSON.stringify(user));
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    // Add a country to favorites
    const addFavorite = (country) => {
        const updatedFavorites = [...favorites, country];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

    // Remove a country from favorites
    const removeFavorite = (countryCode) => {
        const updatedFavorites = favorites.filter(fav => fav.alpha3Code !== countryCode);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

    // Check if a country is in favorites
    const isFavorite = (countryCode) => {
        return favorites.some(fav => fav.alpha3Code === countryCode);
    };

    const value = {
        currentUser,
        login,
        logout,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;