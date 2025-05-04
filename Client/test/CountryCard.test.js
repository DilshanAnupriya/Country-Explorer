import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CountryCard from '../src/components/CountryCard';
import useAuth from '../src/hooks/useAuth';

// Mock the useAuth hook
jest.mock('../src/hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('CountryCard Component', () => {
    const mockCountry = {
        cca3: 'USA',
        name: { common: 'United States' },
        flags: { png: 'https://flagcdn.com/us.png' },
        capital: ['Washington, D.C.'],
        region: 'Americas',
        population: 331002651,
        languages: { eng: 'English' },
    };

    const mockAddFavorite = jest.fn();
    const mockRemoveFavorite = jest.fn();
    const mockIsFavorite = jest.fn();

    beforeEach(() => {
        useAuth.mockReturnValue({
            currentUser: { id: 1, name: 'Test User' },
            addFavorite: mockAddFavorite,
            removeFavorite: mockRemoveFavorite,
            isFavorite: mockIsFavorite,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders country details correctly', () => {
        mockIsFavorite.mockReturnValue(false);

        render(
            <Router>
                <CountryCard country={mockCountry} />
            </Router>
        );

        expect(screen.getAllByText('United States')[0]).toBeInTheDocument(); // Header in the overlay
        expect(screen.getByText('Capital:')).toBeInTheDocument();
        expect(screen.getByText('Washington, D.C.')).toBeInTheDocument();
        expect(screen.getByText('Region:')).toBeInTheDocument();
        expect(screen.getByText('Americas')).toBeInTheDocument();
        expect(screen.getByText('Population:')).toBeInTheDocument();
        expect(screen.getByText('331,002,651')).toBeInTheDocument();
        expect(screen.getByText('Languages:')).toBeInTheDocument();
        expect(screen.getByText('English')).toBeInTheDocument();
    });

    test('renders the favorite button and toggles favorite state', () => {
        mockIsFavorite.mockReturnValue(false);

        render(
            <Router>
                <CountryCard country={mockCountry} />
            </Router>
        );

        const favoriteButton = screen.getByRole('button', { name: /Add to favorites/i });
        expect(favoriteButton).toBeInTheDocument();

        fireEvent.click(favoriteButton);
        expect(mockAddFavorite).toHaveBeenCalledWith(mockCountry);

        mockIsFavorite.mockReturnValue(true);
        render(
            <Router>
                <CountryCard country={mockCountry} />
            </Router>
        );

        const removeFavoriteButton = screen.getByRole('button', { name: /Remove from favorites/i });
        fireEvent.click(removeFavoriteButton);
        expect(mockRemoveFavorite).toHaveBeenCalledWith(mockCountry.cca3);
    });

    test('handles missing data gracefully', () => {
        const incompleteCountry = {
            cca3: 'XYZ',
            name: { common: 'Unknown Country' },
        };

        render(
            <Router>
                <CountryCard country={incompleteCountry} />
            </Router>
        );

        expect(screen.getAllByText('Unknown Country')[0]).toBeInTheDocument(); // Header in the overlay
        expect(screen.getByText('Capital:')).toBeInTheDocument();
        expect(screen.getAllByText('N/A')[0]).toBeInTheDocument(); // Capital
        expect(screen.getByText('Region:')).toBeInTheDocument();
        expect(screen.getAllByText('N/A')[1]).toBeInTheDocument(); // Region
        expect(screen.getByText('Population:')).toBeInTheDocument();
        expect(screen.getAllByText('N/A')[2]).toBeInTheDocument(); // Population
        expect(screen.getByText('Languages:')).toBeInTheDocument();
        expect(screen.getAllByText('N/A')[3]).toBeInTheDocument(); // Languages
    });

    test('displays placeholder image if flag is not available', () => {
        const countryWithoutFlag = {
            ...mockCountry,
            flags: {},
        };

        render(
            <Router>
                <CountryCard country={countryWithoutFlag} />
            </Router>
        );

        const flagImage = screen.getByAltText('Flag of United States');
        fireEvent.error(flagImage); // Simulate image load error
        expect(flagImage).toHaveAttribute('src', 'https://via.placeholder.com/300x200?text=Flag+Not+Available');
    });
});