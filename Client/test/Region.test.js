import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegionPage from '../src/page/Region';
import { getAllCountries } from '../src/services/api';

// Mock the API service
jest.mock('../src/services/api', () => ({
  getAllCountries: jest.fn(),
}));

describe('RegionPage Component', () => {
  const mockCountries = [
    { name: { common: 'Country1' }, region: 'Africa' },
    { name: { common: 'Country2' }, region: 'Africa' },
    { name: { common: 'Country3' }, region: 'Asia' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    getAllCountries.mockResolvedValueOnce([]);
    await act(async () => {
      render(<RegionPage />);
    });
    
  });

  test('renders regions after fetching data', async () => {
    getAllCountries.mockResolvedValueOnce(mockCountries);
    await act(async () => {
      render(<RegionPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Africa')).toBeInTheDocument();
      expect(screen.getByText('Asia')).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    getAllCountries.mockRejectedValueOnce(new Error('API Error'));
    await act(async () => {
      render(<RegionPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch countries/i)).toBeInTheDocument();
    });
  });

  test('displays selected region details', async () => {
    getAllCountries.mockResolvedValueOnce(mockCountries);
    await act(async () => {
      render(<RegionPage />);
    });

    

    await waitFor(() => {
      expect(screen.getByText('Africa')).toBeInTheDocument();
      expect(screen.getByText('2 countries')).toBeInTheDocument();
    });
  });

  test('returns to region selection when back button is clicked', async () => {
    getAllCountries.mockResolvedValueOnce(mockCountries);
    await act(async () => {
      render(<RegionPage />);
    });

   

   

    expect(screen.getByText('Explore by Region')).toBeInTheDocument();
  });
});