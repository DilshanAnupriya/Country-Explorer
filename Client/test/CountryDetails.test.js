import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CountryDetails from '../src/page/CountryDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock the API call
jest.mock('../src/services/api', () => ({
  getCountryByCode: jest.fn(),
}));

// Mock useAuth hook
jest.mock('../src/hooks/useAuth', () => {
  const addFavorite = jest.fn();
  const removeFavorite = jest.fn();
  const isFavorite = jest.fn();
  const mockUser = { name: 'Test User' };

  return () => ({
    currentUser: mockUser,
    addFavorite,
    removeFavorite,
    isFavorite,
  });
});

// Helper to render with router
const renderWithRouter = (ui, { route = '/country/USA' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/country/:code" element={ui} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CountryDetails', () => {
  const mockCountry = {
    cca3: 'USA',
    name: {
      common: 'United States',
      nativeName: { eng: { common: 'United States' } },
    },
    population: 331000000,
    region: 'Americas',
    capital: ['Washington D.C.'],
    currencies: { USD: { name: 'United States dollar', symbol: '$' } },
    languages: { eng: 'English' },
    tld: ['.us'],
    area: 9833520,
    borders: ['CAN', 'MEX'],
    subregion: 'Northern America',
    flags: { png: 'flag.png' },
    maps: { googleMaps: 'https://maps.google.com', openStreetMaps: 'https://osm.org' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner initially', async () => {
    const { getCountryByCode } = require('../src/services/api');
    getCountryByCode.mockReturnValue(new Promise(() => {})); // never resolves

    renderWithRouter(<CountryDetails />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message on API error', async () => {
    const { getCountryByCode } = require('../src/services/api');
    getCountryByCode.mockRejectedValue(new Error('API Error'));

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error

    renderWithRouter(<CountryDetails />);
    await waitFor(() =>
        expect(screen.getByText(/Failed to fetch country details/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();

    consoleErrorMock.mockRestore(); // Restore console.error after the test
  });

  it('shows "Country not found" if no country data', async () => {
    const { getCountryByCode } = require('../src/services/api');
    getCountryByCode.mockResolvedValue(null);

    renderWithRouter(<CountryDetails />);
    await waitFor(() =>
      expect(screen.getByText(/Country not found/i)).toBeInTheDocument()
    );
  });

  it('renders country details and switches tabs', async () => {
    const { getCountryByCode } = require('../src/services/api');
    getCountryByCode.mockResolvedValue(mockCountry);

    renderWithRouter(<CountryDetails />);
    // Wait for country name to appear
    await waitFor(() =>
        expect(screen.getAllByText('United States')[0]).toBeInTheDocument() // Use getAllByText
    );

    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('331,000,000')).toBeInTheDocument();
    expect(screen.getByText('Region')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('Capital')).toBeInTheDocument();
    expect(screen.getByText('Washington D.C.')).toBeInTheDocument();

    // Switch to Details tab
    fireEvent.click(screen.getByRole('button', { name: /Details/i }));
    expect(screen.getByText(/Sub-region:/i)).toBeInTheDocument();
    expect(screen.getByText(/Languages:/i)).toBeInTheDocument();

    // Switch to Maps tab
    fireEvent.click(screen.getByRole('button', { name: /Maps/i }));
    expect(screen.getByText(/Google Maps/i)).toBeInTheDocument();
    expect(screen.getByText(/OpenStreetMaps/i)).toBeInTheDocument();
  });

  it('toggles favorite status', async () => {
    const { getCountryByCode } = require('../src/services/api');
    getCountryByCode.mockResolvedValue(mockCountry);

    // Get the mocked functions from the useAuth hook
    const authHook = require('../src/hooks/useAuth')();
    const { addFavorite, removeFavorite, isFavorite } = authHook;

    // Set up the initial state - not a favorite
    isFavorite.mockImplementation((countryCode) => countryCode === 'USA' ? false : true);

    renderWithRouter(<CountryDetails />);
    await waitFor(() =>
        expect(screen.getAllByText('United States')[0]).toBeInTheDocument()
    );

    // Find favorite button
    const favBtn = screen.getByRole('button', { name: /Add to favorites/i });

    // First click - add to favorites
    fireEvent.click(favBtn);
    expect(addFavorite).toHaveBeenCalledWith(mockCountry);

    // Update the mock to return true for the next call
    isFavorite.mockImplementation((countryCode) => countryCode === 'USA' ? true : false);

    // Second click - remove from favorites
    fireEvent.click(favBtn);
    
});

  it('renders border countries', async () => {
    const { getCountryByCode } = require('../src/services/api');
    getCountryByCode.mockResolvedValue(mockCountry);

    renderWithRouter(<CountryDetails />);
    await waitFor(() =>
        expect(screen.getAllByText('United States')[0]).toBeInTheDocument() // Use getAllByText
    );

    expect(screen.getByText('Border Countries')).toBeInTheDocument();
    expect(screen.getByText('CAN')).toBeInTheDocument();
    expect(screen.getByText('MEX')).toBeInTheDocument();
  });
});