import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Map from '../../components/Map';

const mockSportsCenters = [
  {
    id: '1',
    name: 'Tennis Club',
    location: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: '2',
    name: 'Soccer Arena',
    location: { lat: 40.7580, lng: -73.9855 },
  },
];

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-popup">{children}</div>
  ),
}));

describe('Map Component', () => {
  it('renders map container', () => {
    render(<Map sportsCenters={mockSportsCenters} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders markers for each sports center', () => {
    render(<Map sportsCenters={mockSportsCenters} />);
    const markers = screen.getAllByTestId('map-marker');
    expect(markers).toHaveLength(mockSportsCenters.length);
  });

  it('shows popup with sports center info on marker click', () => {
    render(<Map sportsCenters={mockSportsCenters} />);
    const marker = screen.getAllByTestId('map-marker')[0];
    fireEvent.click(marker);

    expect(screen.getByText('Tennis Club')).toBeInTheDocument();
  });

  it('centers map on selected sports center', () => {
    const mockOnCenterChange = jest.fn();
    render(
      <Map
        sportsCenters={mockSportsCenters}
        selectedCenter={mockSportsCenters[0]}
        onCenterChange={mockOnCenterChange}
      />
    );

    expect(mockOnCenterChange).toHaveBeenCalledWith({
      lat: 40.7128,
      lng: -74.0060,
    });
  });
}); 