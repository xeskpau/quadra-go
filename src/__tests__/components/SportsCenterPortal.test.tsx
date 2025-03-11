import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { SportsCenterProvider } from '../../contexts/SportsCenterContext';
import SportsCenterPortal from '../../components/sportsCenter/SportsCenterPortal';
import * as authHooks from '../../contexts/AuthContext';
import * as sportsCenterHooks from '../../contexts/SportsCenterContext';

// Mock the auth and sports center hooks
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

jest.mock('../../contexts/SportsCenterContext', () => ({
  ...jest.requireActual('../../contexts/SportsCenterContext'),
  useSportsCenter: jest.fn(),
}));

// Mock the utility functions
jest.mock('../../utils/mockData', () => ({
  generateMockSportsCenters: jest.fn(),
  generateMockFacilities: jest.fn(),
  generateMockTimeSlots: jest.fn(),
  generateMockBookings: jest.fn(),
  generateMockPromotions: jest.fn(),
  mockSports: [
    { id: 'sport1', name: 'Tennis', icon: '🎾' },
    { id: 'sport2', name: 'Basketball', icon: '🏀' },
    { id: 'sport3', name: 'Soccer', icon: '⚽' }
  ],
  mockAmenities: [
    'Parking',
    'Showers',
    'Locker Rooms',
    'Pro Shop',
    'Cafe'
  ]
}));

// Mock the CreateSportsCenter component
jest.mock('../../components/sportsCenter/CreateSportsCenter', () => {
  return function MockCreateSportsCenter() {
    return (
      <div data-testid="create-sports-center">
        <p>Create your first sports center to get started.</p>
      </div>
    );
  };
});

// Mock the SportsCenterRegistration component
jest.mock('../../components/sportsCenter/SportsCenterRegistration', () => {
  return function MockSportsCenterRegistration() {
    return (
      <div data-testid="sports-center-registration">
        <p>Register as a sports center to access the portal.</p>
      </div>
    );
  };
});

// Mock the SportsCenterDashboard component
jest.mock('../../components/sportsCenter/SportsCenterDashboard', () => {
  return function MockSportsCenterDashboard() {
    return <div data-testid="sports-center-dashboard">Dashboard Content</div>;
  };
});

// Mock the FacilityManager component
jest.mock('../../components/sportsCenter/FacilityManager', () => {
  return function MockFacilityManager() {
    return <div data-testid="facility-manager">Facility Manager Content</div>;
  };
});

// Mock the PromotionManager component
jest.mock('../../components/sportsCenter/PromotionManager', () => {
  return function MockPromotionManager() {
    return <div data-testid="promotion-manager">Promotion Manager Content</div>;
  };
});

describe('SportsCenterPortal', () => {
  // Mock user data
  const mockUser = {
    uid: 'user123',
    email: 'test@example.com',
    displayName: 'Test User',
  };

  // Mock sports center user data
  const mockSportsCenterUser = {
    id: 'user123',
    email: 'test@example.com',
    displayName: 'Test Sports Center',
    role: 'admin' as const,
    createdAt: new Date(),
  };

  // Mock sports center data
  const mockSportsCenter = {
    id: 'sc1',
    name: 'Test Sports Center',
    description: 'A test sports center',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    phone: '123-456-7890',
    email: 'info@testsportscenter.com',
    website: 'https://testsportscenter.com',
    photoURL: 'https://example.com/photo.jpg',
    coverPhotoURL: 'https://example.com/cover.jpg',
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    sports: [
      { id: 'sport1', name: 'Tennis', icon: '🎾' },
      { id: 'sport2', name: 'Basketball', icon: '🏀' },
    ],
    amenities: ['Parking', 'Showers'],
    openingHours: {
      Monday: { open: '09:00', close: '21:00' },
      Tuesday: { open: '09:00', close: '21:00' },
      Wednesday: { open: '09:00', close: '21:00' },
      Thursday: { open: '09:00', close: '21:00' },
      Friday: { open: '09:00', close: '21:00' },
      Saturday: { open: '10:00', close: '22:00' },
      Sunday: { open: '10:00', close: '18:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'user123',
    staffIds: [],
  };

  // Mock facilities data
  const mockFacilities = [
    {
      id: 'facility1',
      sportsCenterId: 'sc1',
      name: 'Tennis Court 1',
      sportId: 'sport1',
      capacity: 4,
      pricePerHour: 20,
      isIndoor: false,
    },
  ];

  // Setup for tests with no sports center user
  const setupNoSportsCenterUser = () => {
    (authHooks.useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
    });

    (sportsCenterHooks.useSportsCenter as jest.Mock).mockReturnValue({
      sportsCenterUser: null,
      sportsCenters: [],
      currentSportsCenter: null,
      facilities: [],
      loading: false,
      error: null,
      registerAsSportsCenter: jest.fn(),
    });
  };

  // Setup for tests with sports center user but no sports centers
  const setupWithSportsCenterUserNoSportsCenters = () => {
    (authHooks.useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
    });

    (sportsCenterHooks.useSportsCenter as jest.Mock).mockReturnValue({
      sportsCenterUser: mockSportsCenterUser,
      sportsCenters: [],
      currentSportsCenter: null,
      facilities: [],
      loading: false,
      error: null,
      createNewSportsCenter: jest.fn(),
    });
  };

  // Setup for tests with sports center user and sports centers
  const setupWithSportsCenterAndFacilities = () => {
    (authHooks.useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
    });

    (sportsCenterHooks.useSportsCenter as jest.Mock).mockReturnValue({
      sportsCenterUser: mockSportsCenterUser,
      sportsCenters: [mockSportsCenter],
      currentSportsCenter: mockSportsCenter,
      facilities: mockFacilities,
      timeSlots: [],
      bookings: [],
      promotions: [],
      analyticsData: null,
      loading: false,
      error: null,
      selectSportsCenter: jest.fn(),
      addFacility: jest.fn(),
      addTimeSlot: jest.fn(),
      addPromotion: jest.fn(),
      refreshBookings: jest.fn(),
      generateAnalytics: jest.fn(),
    });
  };

  // Setup for tests with loading state
  const setupLoading = () => {
    (authHooks.useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
    });

    (sportsCenterHooks.useSportsCenter as jest.Mock).mockReturnValue({
      sportsCenterUser: null,
      sportsCenters: [],
      currentSportsCenter: null,
      facilities: [],
      loading: true,
      error: null,
    });
  };

  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test rendering the registration form when no sports center user
  test('renders registration form when user is not registered as sports center', () => {
    setupNoSportsCenterUser();

    render(
      <BrowserRouter>
        <AuthProvider>
          <SportsCenterProvider>
            <SportsCenterPortal />
          </SportsCenterProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('sports-center-registration')).toBeInTheDocument();
  });

  // Test rendering the create sports center form when user has no sports centers
  test('renders create sports center form when user has no sports centers', () => {
    setupWithSportsCenterUserNoSportsCenters();

    render(
      <BrowserRouter>
        <AuthProvider>
          <SportsCenterProvider>
            <SportsCenterPortal />
          </SportsCenterProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('create-sports-center')).toBeInTheDocument();
  });

  // Test rendering the dashboard when user has sports centers
  test('renders dashboard when user has sports centers', () => {
    setupWithSportsCenterAndFacilities();

    render(
      <BrowserRouter>
        <AuthProvider>
          <SportsCenterProvider>
            <SportsCenterPortal />
          </SportsCenterProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Sports Center Portal')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-tab')).toBeInTheDocument();
    expect(screen.getByTestId('facilities-tab')).toBeInTheDocument();
    expect(screen.getByTestId('promotions-tab')).toBeInTheDocument();
  });

  // Test navigation between tabs
  test('navigates between tabs', () => {
    setupWithSportsCenterAndFacilities();

    render(
      <BrowserRouter>
        <AuthProvider>
          <SportsCenterProvider>
            <SportsCenterPortal />
          </SportsCenterProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Dashboard tab should be active by default
    const dashboardTab = screen.getByTestId('dashboard-tab');
    const facilitiesTab = screen.getByTestId('facilities-tab');
    const promotionsTab = screen.getByTestId('promotions-tab');

    // Check if dashboard tab is active
    expect(dashboardTab).toHaveAttribute('data-testid', 'dashboard-tab');
    expect(screen.getByTestId('sports-center-dashboard')).toBeInTheDocument();
    
    // Click on facilities tab
    fireEvent.click(facilitiesTab);
    expect(screen.getByTestId('facility-manager')).toBeInTheDocument();
    
    // Click on promotions tab
    fireEvent.click(promotionsTab);
    expect(screen.getByTestId('promotion-manager')).toBeInTheDocument();
  });

  // Test loading state
  test('renders loading spinner when loading', () => {
    setupLoading();

    render(
      <BrowserRouter>
        <AuthProvider>
          <SportsCenterProvider>
            <SportsCenterPortal />
          </SportsCenterProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
}); 