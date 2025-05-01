import Favorites from "../pages/Favorites.jsx";
import {useState} from "react";

const FilterOptions = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handleChange = (e) => {
        onChange(e.target.value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div
                className={`relative cursor-pointer transition-all duration-300 ${hovered ? 'shadow-md' : 'shadow-sm'}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <select
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    className={`appearance-none bg-white border-2 text-gray-800 text-sm rounded-lg block w-full p-3 pl-4 pr-10 cursor-pointer transition-all duration-300 hover:border-blue-400 ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}
                >
                    <option value="">All</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                        className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default FilterOptions;