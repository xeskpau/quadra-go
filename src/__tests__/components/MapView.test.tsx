import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapView from '../../components/discovery/MapView';

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn().mockImplementation(({ children }) => (
    <div data-testid="map-container">{children}</div>
  )),
  TileLayer: jest.fn().mockImplementation(() => <div data-testid="tile-layer" />),
  Marker: jest.fn().mockImplementation(({ children }) => (
    <div data-testid="marker">{children}</div>
  )),
  Popup: jest.fn().mockImplementation(({ children }) => (
    <div data-testid="popup">{children}</div>
  )),
  useMap: jest.fn().mockReturnValue({
    setView: jest.fn(),
    getZoom: jest.fn().mockReturnValue(12),
  }),
}));

// Mock leaflet
jest.mock('leaflet', () => ({
  Icon: jest.fn().mockImplementation(() => ({})),
  LatLngExpression: jest.fn(),
}));

describe('MapView Component', () => {
  const mockSportsCenters = [
    {
      id: 'center1',
      name: 'Tennis Club',
      description: 'A premier tennis facility in New York',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      sports: [{ id: 'sport1', name: 'Tennis', icon: 'tennis' }],
      amenities: ['parking', 'showers', 'lockers'],
      openingHours: {
        monday: { open: '08:00', close: '22:00' }
      },
      location: { latitude: 40.7128, longitude: -74.006 },
      photoURL: 'https://example.com/tennis.jpg',
      email: 'info@tennis.com',
      phone: '123-456-7890',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'owner1',
      staffIds: []
    },
    {
      id: 'center2',
      name: 'Basketball Arena',
      description: 'A modern basketball facility in Los Angeles',
      address: '456 Park Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      sports: [{ id: 'sport2', name: 'Basketball', icon: 'basketball' }],
      amenities: ['parking', 'showers'],
      openingHours: {
        monday: { open: '09:00', close: '21:00' }
      },
      location: { latitude: 34.0522, longitude: -118.2437 },
      photoURL: 'https://example.com/basketball.jpg',
      email: 'info@basketball.com',
      phone: '123-456-7890',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'owner2',
      staffIds: []
    }
  ];

  const mockCalculateDistance = jest.fn().mockReturnValue(5.2);

  beforeEach(() => {
    mockCalculateDistance.mockClear();
  });

  it('renders the map container', () => {
    render(
      <MapView 
        sportsCenters={mockSportsCenters} 
        calculateDistance={mockCalculateDistance} 
      />
    );
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('renders markers for each sports center', () => {
    render(
      <MapView 
        sportsCenters={mockSportsCenters} 
        calculateDistance={mockCalculateDistance} 
      />
    );
    
    // There should be one marker for each sports center
    const markers = screen.getAllByTestId('marker');
    expect(markers.length).toBe(mockSportsCenters.length);
  });

  it('renders user location marker when user location is provided', () => {
    const userLocation = { latitude: 40.7128, longitude: -74.006 };
    
    render(
      <MapView 
        sportsCenters={mockSportsCenters} 
        userLocation={userLocation}
        calculateDistance={mockCalculateDistance} 
      />
    );
    
    // There should be markers for each sports center plus one for the user location
    const markers = screen.getAllByTestId('marker');
    expect(markers.length).toBe(mockSportsCenters.length + 1);
    
    // There should be a popup with "Your Location" text
    expect(screen.getByText('Your Location')).toBeInTheDocument();
  });

  it('calculates distance when user location is provided', () => {
    // Clear any previous calls
    mockCalculateDistance.mockClear();
    
    const userLocation = { latitude: 40.7128, longitude: -74.006 };
    
    render(
      <MapView 
        sportsCenters={mockSportsCenters} 
        userLocation={userLocation}
        calculateDistance={mockCalculateDistance} 
      />
    );
    
    // The calculateDistance function should be called for each sports center
    // Note: In the implementation, it might be called multiple times due to React's rendering behavior
    // So we just check that it was called at least once for each center
    expect(mockCalculateDistance).toHaveBeenCalledTimes(mockSportsCenters.length);
  });
}); 