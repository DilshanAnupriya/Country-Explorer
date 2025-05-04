import axios from 'axios';

// Set base URL for API requests (adjust this to your backend URL)
axios.defaults.baseURL = 'http://localhost:3000';

// Add a request interceptor for authentication
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Handle token expiration - could redirect to login or refresh token
            if (error.response.data.message === 'Token expired') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;