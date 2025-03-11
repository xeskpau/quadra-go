import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SportsCenterDiscovery from '../../components/discovery/SportsCenterDiscovery';

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getFirestore: jest.fn(),
}));

// Mock the getSportsCenters and getSports functions
jest.mock('../../firebase', () => ({
  getSportsCenters: jest.fn(),
  getSports: jest.fn(),
}));

// Import the actual functions to mock
import * as firebase from '../../firebase';

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

// Assign mock to global navigator
Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

describe('SportsCenterDiscovery Component', () => {
  // Mock data
  const mockSports = [
    { id: 'sport1', name: 'Tennis', icon: 'tennis' },
    { id: 'sport2', name: 'Basketball', icon: 'basketball' },
    { id: 'sport3', name: 'Swimming', icon: 'swimming' },
  ];

  const mockSportsCenters = [
    {
      id: 'center1',
      name: 'Tennis Club',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      sports: [{ id: 'sport1', name: 'Tennis' }],
      priceRange: { min: 20, max: 100 },
      location: { lat: 40.7128, lng: -74.006 },
      photoURL: 'https://example.com/tennis.jpg',
    },
    {
      id: 'center2',
      name: 'Basketball Arena',
      address: '456 Park Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      sports: [{ id: 'sport2', name: 'Basketball' }],
      priceRange: { min: 30, max: 150 },
      location: { lat: 34.0522, lng: -118.2437 },
      photoURL: 'https://example.com/basketball.jpg',
    },
    {
      id: 'center3',
      name: 'Aquatic Center',
      address: '789 Ocean Dr',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      sports: [{ id: 'sport3', name: 'Swimming' }, { id: 'sport1', name: 'Tennis' }],
      priceRange: { min: 25, max: 120 },
      location: { lat: 25.7617, lng: -80.1918 },
      photoURL: 'https://example.com/swimming.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the API calls
    (firebase.getSportsCenters as jest.Mock).mockResolvedValue(mockSportsCenters);
    (firebase.getSports as jest.Mock).mockResolvedValue(mockSports);
    
    // Reset geolocation mock
    mockGeolocation.getCurrentPosition.mockReset();
  });

  it('renders loading state initially', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('renders error state when API call fails', async () => {
    // Mock API failure
    (firebase.getSportsCenters as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('renders filter controls', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if filter controls are rendered
    expect(screen.getByTestId('sport-filter')).toBeInTheDocument();
    expect(screen.getByTestId('price-min-filter')).toBeInTheDocument();
    expect(screen.getByTestId('price-max-filter')).toBeInTheDocument();
    expect(screen.getByTestId('distance-filter')).toBeInTheDocument();
    expect(screen.getByTestId('clear-filters-button')).toBeInTheDocument();
    expect(screen.getByTestId('use-location-button')).toBeInTheDocument();
  });

  it('applies sport filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Select Tennis sport filter
    const sportFilter = screen.getByTestId('sport-filter');
    fireEvent.change(sportFilter, { target: { value: 'sport1' } });
    
    // Check that the filter was applied
    expect(sportFilter).toHaveValue('sport1');
  });

  it('applies price filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Set min price to 30
    const minPriceFilter = screen.getByTestId('price-min-filter');
    fireEvent.change(minPriceFilter, { target: { value: '30' } });
    
    // Check that the filter was applied
    expect(minPriceFilter).toHaveValue(30);
  });

  it('clears filters when clear button is clicked', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Set min price to 200
    const minPriceFilter = screen.getByTestId('price-min-filter');
    fireEvent.change(minPriceFilter, { target: { value: '200' } });
    
    // Check that the filter was applied
    expect(minPriceFilter).toHaveValue(200);
    
    // Clear filters
    const clearButton = screen.getByTestId('clear-filters-button');
    fireEvent.click(clearButton);
    
    // Check that the filter was cleared
    expect(minPriceFilter).toHaveValue(null);
  });

  it('shows empty state when filters are applied', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Set min price to 200 (higher than any center's max price)
    const minPriceFilter = screen.getByTestId('price-min-filter');
    fireEvent.change(minPriceFilter, { target: { value: '200' } });
    
    // Wait for empty state to be shown
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('handles geolocation when location button is clicked', async () => {
    // Mock successful geolocation
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      });
    });
    
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Click use location button
    const locationButton = screen.getByTestId('use-location-button');
    fireEvent.click(locationButton);
    
    // Verify geolocation was called
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });
}); 