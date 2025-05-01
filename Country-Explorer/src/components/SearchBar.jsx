import React, { useState, useEffect } from 'react';

// SearchBar Component with modern styling and animations
const SearchBar = ({ searchTerm, onSearch }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const [isFocused, setIsFocused] = useState(false);

    // Update local state when prop changes
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    // Handle input change
    const handleChange = (e) => {
        setLocalSearchTerm(e.target.value);
    };

    // Handle search submission
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        onSearch(localSearchTerm);
    };

    // Handle debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(localSearchTerm);
        }, 400);

        return () => clearTimeout(timer);
    }, [localSearchTerm, onSearch]);

    return (
        <div className="w-full">
            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-102' : ''}`}>
                <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-all duration-300 ${isFocused ? 'text-blue-600' : 'text-gray-500'}`}>
                    <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isFocused ? 'scale-110' : ''}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    className="block w-full p-4 pl-12 text-sm text-gray-900 border-2 rounded-lg bg-white focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                        borderColor: isFocused ? '#3b82f6' : '#e5e7eb',
                        boxShadow: isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : ''
                    }}
                    placeholder="Search for countries..."
                    value={localSearchTerm}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button
                    onClick={handleSubmit}
                    className="text-white absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-all duration-200 hover:scale-105"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchBar;