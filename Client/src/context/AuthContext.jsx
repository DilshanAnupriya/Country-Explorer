import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [authChecked, setAuthChecked] = useState(false);

    // Ref to ensure initAuth runs only once
    const initAuthCalled = useRef(false);

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check if user is logged in ONLY on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = sessionStorage.getItem('token');
            const storedFavorites = localStorage.getItem('favorites');

            if (storedToken) {
                setToken(storedToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

                try {
                    // Get current user data based on token
                    const response = await axios.get('http://localhost:3000/api/v1/user/user-by');
                    if (response.data && response.data.User) {
                        setCurrentUser(response.data.User);
                    } else {
                        // Token might be invalid, clear it
                        localStorage.removeItem('token');
                        setToken(null);
                    }
                } catch (error) {
                    console.error('Failed to get user data:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }

            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }

            setLoading(false);
            setAuthChecked(true); // Mark authentication as checked
        };

        // Ensure initAuth runs only once
        if (!initAuthCalled.current) {
            initAuthCalled.current = true;
            initAuth();
        }
    }, []); // Empty dependency array ensures it runs only once

    // Login function - updates state without rechecking
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/login', {
                username,
                password,
            });

            if (response.data && response.data.token) {
                const tokenValue = response.data.token;
                sessionStorage.setItem('token', tokenValue);
                setToken(tokenValue);

                // Get user data and update state directly
                const userResponse = await axios.get('http://localhost:3000/api/v1/user/user-by', {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });

                if (userResponse.data && userResponse.data.User) {
                    setCurrentUser(userResponse.data.User);
                    return { success: true };
                }
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.error || 'Failed to login',
            };
        }
    };

    // Signup function
    const signup = async (username, email, password, role = ['User']) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/signup', {
                username,
                email,
                password,
                role,
            });

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: error.response?.data?.error || 'Failed to signup',
            };
        }
    };

    // Logout function - updates state directly
    const logout = () => {
        sessionStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // Add a country to favorites
    const addFavorite = (country) => {
        const updatedFavorites = [...favorites, country];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

    // Remove a country from favorites
    const removeFavorite = (countryCode) => {
        const updatedFavorites = favorites.filter((fav) => fav.alpha3Code !== countryCode);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

    // Check if a country is in favorites
    const isFavorite = (countryCode) => {
        return favorites.some((fav) => fav.alpha3Code === countryCode);
    };

    const value = {
        currentUser,
        token,
        login,
        signup,
        logout,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
        authChecked, // Expose the authChecked state
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;