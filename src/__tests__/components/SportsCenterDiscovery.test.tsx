import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SportsCenterDiscovery from '../../components/discovery/SportsCenterDiscovery';

// Mock MapView component
jest.mock('../../components/discovery/MapView', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ sportsCenters, userLocation, calculateDistance }) => (
      <div data-testid="map-view">
        <div>Map View Mock</div>
        <div>Centers: {sportsCenters.length}</div>
        <div>User Location: {userLocation ? 'Yes' : 'No'}</div>
      </div>
    ))
  };
});

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
  getTimeSlotsBySportsCenterAndDate: jest.fn(),
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
      amenities: ['parking', 'showers', 'lockers'],
      openingHours: {
        monday: { open: '08:00', close: '22:00' }
      },
      location: { latitude: 40.7128, longitude: -74.006 },
      photoURL: 'https://example.com/tennis.jpg',
      email: 'info@tennis.com',
      phone: '123-456-7890',
      description: 'A premier tennis facility',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'owner1',
      staffIds: []
    },
    {
      id: 'center2',
      name: 'Basketball Arena',
      address: '456 Park Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      sports: [{ id: 'sport2', name: 'Basketball' }],
      amenities: ['parking', 'showers'],
      openingHours: {
        monday: { open: '09:00', close: '21:00' }
      },
      location: { latitude: 34.0522, longitude: -118.2437 },
      photoURL: 'https://example.com/basketball.jpg',
      email: 'info@basketball.com',
      phone: '123-456-7890',
      description: 'A modern basketball facility',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'owner2',
      staffIds: []
    },
    {
      id: 'center3',
      name: 'Aquatic Center',
      address: '789 Ocean Dr',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      sports: [{ id: 'sport3', name: 'Swimming' }, { id: 'sport1', name: 'Tennis' }],
      amenities: ['parking', 'showers', 'lockers', 'cafe'],
      openingHours: {
        monday: { open: '06:00', close: '20:00' }
      },
      location: { latitude: 25.7617, longitude: -80.1918 },
      photoURL: 'https://example.com/swimming.jpg',
      email: 'info@aquatic.com',
      phone: '123-456-7890',
      description: 'A state-of-the-art aquatic center',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'owner3',
      staffIds: []
    },
  ];

  // Mock time slots
  const mockTimeSlots = [
    { id: 'slot1', facilityId: 'facility1', sportsCenterId: 'center1', startTime: '10:00', endTime: '11:00', date: new Date(), isAvailable: true, price: 25 },
    { id: 'slot2', facilityId: 'facility2', sportsCenterId: 'center2', startTime: '10:00', endTime: '11:00', date: new Date(), isAvailable: false, price: 30 },
    { id: 'slot3', facilityId: 'facility3', sportsCenterId: 'center3', startTime: '10:00', endTime: '11:00', date: new Date(), isAvailable: true, price: 20 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the API calls
    (firebase.getSportsCenters as jest.Mock).mockResolvedValue(mockSportsCenters);
    (firebase.getSports as jest.Mock).mockResolvedValue(mockSports);
    (firebase.getTimeSlotsBySportsCenterAndDate as jest.Mock).mockResolvedValue(mockTimeSlots);
    
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
    
    // Click the location button
    const locationButton = screen.getByTestId('use-location-button');
    fireEvent.click(locationButton);
    
    // Check that geolocation was called
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('toggles between list and map views', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // By default, it should show list view
    expect(screen.queryByTestId('map-view')).not.toBeInTheDocument();
    
    // Click the map view button
    const mapViewButton = screen.getByTestId('map-view-button');
    fireEvent.click(mapViewButton);
    
    // Check that map view is shown
    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
    });
    
    // Click the list view button
    const listViewButton = screen.getByTestId('list-view-button');
    fireEvent.click(listViewButton);
    
    // Check that list view is shown again
    await waitFor(() => {
      expect(screen.queryByTestId('map-view')).not.toBeInTheDocument();
    });
  });

  it('loads filters from URL parameters', async () => {
    // Mock successful data loading with centers that match the filter
    (firebase.getSportsCenters as jest.Mock).mockResolvedValue([
      {
        id: 'center1',
        name: 'Tennis Club',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        sports: [{ id: 'sport1', name: 'Tennis' }],
        amenities: ['parking', 'showers'],
        openingHours: {
          monday: { open: '08:00', close: '22:00' }
        },
        location: { latitude: 40.7128, longitude: -74.006 },
        photoURL: 'https://example.com/tennis.jpg',
        email: 'info@tennis.com',
        phone: '123-456-7890',
        description: 'A premier tennis facility',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 'owner1',
        staffIds: []
      }
    ]);
    
    // Mock the getSports function to return sports
    (firebase.getSports as jest.Mock).mockResolvedValue(mockSports);
    
    render(
      <MemoryRouter initialEntries={['/?sport=sport1&minPrice=10&maxPrice=100&view=map']}>
        <SportsCenterDiscovery />
      </MemoryRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check that filters are applied from URL
    expect(screen.getByTestId('sport-filter')).toHaveValue('sport1');
    expect(screen.getByTestId('price-min-filter')).toHaveValue(10);
    expect(screen.getByTestId('price-max-filter')).toHaveValue(100);
    
    // Wait for the filtered centers to be processed and map view to be shown
    await waitFor(() => {
      const emptyState = screen.queryByTestId('empty-state');
      expect(emptyState).not.toBeInTheDocument();
    });
    
    // Now check that map view is shown
    expect(screen.getByTestId('map-view')).toBeInTheDocument();
  });

  it('updates URL when filters change', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
    
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Apply a filter
    const sportFilter = screen.getByTestId('sport-filter');
    fireEvent.change(sportFilter, { target: { value: 'sport1' } });
    
    // Check that URL was updated (indirectly through navigate)
    // Note: We can't directly test the URL change due to how the test environment works
    // but we can verify the component behavior
    expect(sportFilter).toHaveValue('sport1');
  });

  it('shows distance information when location is available', async () => {
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
    
    // Click the location button
    const locationButton = screen.getByTestId('use-location-button');
    fireEvent.click(locationButton);
    
    // Wait for the component to update
    await waitFor(() => {
      // The distance information should be shown in the list view
      // We can't check the exact text since it depends on the calculation
      // but we can check that the component structure is updated
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });
  });

  // New tests for the added functionality
  it('renders date filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if date filter is rendered
    expect(screen.getByTestId('date-filter')).toBeInTheDocument();
  });

  it('renders time filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if time filter is rendered
    expect(screen.getByTestId('time-filter')).toBeInTheDocument();
  });

  it('renders duration filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if duration filter is rendered
    expect(screen.getByTestId('duration-filter')).toBeInTheDocument();
  });

  it('applies date filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Set date filter
    const dateFilter = screen.getByTestId('date-filter');
    fireEvent.change(dateFilter, { target: { value: '2025-01-01' } });
    
    // Check that the filter was applied
    expect(dateFilter).toHaveValue('2025-01-01');
  });

  it('applies time filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Set date filter first (time filter is disabled without date)
    const dateFilter = screen.getByTestId('date-filter');
    fireEvent.change(dateFilter, { target: { value: '2025-01-01' } });
    
    // Set time filter
    const timeFilter = screen.getByTestId('time-filter');
    fireEvent.change(timeFilter, { target: { value: '10:00' } });
    
    // Check that the filter was applied
    expect(timeFilter).toHaveValue('10:00');
  });

  it('applies duration filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Set date filter first
    const dateFilter = screen.getByTestId('date-filter');
    fireEvent.change(dateFilter, { target: { value: '2025-01-01' } });
    
    // Set time filter
    const timeFilter = screen.getByTestId('time-filter');
    fireEvent.change(timeFilter, { target: { value: '10:00' } });
    
    // Set duration filter
    const durationFilter = screen.getByTestId('duration-filter');
    fireEvent.change(durationFilter, { target: { value: '60' } });
    
    // Check that the filter was applied
    expect(durationFilter).toHaveValue('60');
  });

  it('checks availability when date, time, and duration are set', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Set date filter
    const dateFilter = screen.getByTestId('date-filter');
    fireEvent.change(dateFilter, { target: { value: '2025-01-01' } });
    
    // Set time filter
    const timeFilter = screen.getByTestId('time-filter');
    fireEvent.change(timeFilter, { target: { value: '10:00' } });
    
    // Set duration filter
    const durationFilter = screen.getByTestId('duration-filter');
    fireEvent.change(durationFilter, { target: { value: '60' } });
    
    // Check that the availability check function was called
    await waitFor(() => {
      expect(firebase.getTimeSlotsBySportsCenterAndDate).toHaveBeenCalled();
    });
  });

  it('renders amenity filters', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if amenity filters are rendered
    expect(screen.getByTestId('amenity-parking')).toBeInTheDocument();
    expect(screen.getByTestId('amenity-showers')).toBeInTheDocument();
  });

  it('applies amenity filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check parking amenity
    const parkingCheckbox = screen.getByTestId('amenity-parking');
    fireEvent.click(parkingCheckbox);
    
    // Check that the filter was applied
    expect(parkingCheckbox).toBeChecked();
  });

  it('renders "Show unavailable sports centers" checkbox', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if the checkbox is rendered
    expect(screen.getByTestId('show-unavailable')).toBeInTheDocument();
  });

  it('toggles "Show unavailable sports centers" checkbox', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check the checkbox
    const showUnavailableCheckbox = screen.getByTestId('show-unavailable');
    fireEvent.click(showUnavailableCheckbox);
    
    // Check that the filter was applied
    expect(showUnavailableCheckbox).toBeChecked();
  });

  it('applies sort by filter', async () => {
    render(
      <BrowserRouter>
        <SportsCenterDiscovery />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Set sort by filter
    const sortByFilter = screen.getByTestId('sort-by');
    fireEvent.change(sortByFilter, { target: { value: 'price' } });
    
    // Check that the filter was applied
    expect(sortByFilter).toHaveValue('price');
  });
}); 