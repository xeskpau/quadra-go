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
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '10:00', close: '18:00' },
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

    expect(screen.getByText('Register as a sports center to access the portal.')).toBeInTheDocument();
    expect(screen.getByTestId('display-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('role-select')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
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

    expect(screen.getByText('Create your first sports center to get started.')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
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

    expect(dashboardTab).toHaveStyle('border-bottom: 2px solid #0072ff');

    // Click on facilities tab
    fireEvent.click(facilitiesTab);
    expect(facilitiesTab).toHaveStyle('border-bottom: 2px solid #0072ff');
    expect(dashboardTab).not.toHaveStyle('border-bottom: 2px solid #0072ff');

    // Click on promotions tab
    fireEvent.click(promotionsTab);
    expect(promotionsTab).toHaveStyle('border-bottom: 2px solid #0072ff');
    expect(facilitiesTab).not.toHaveStyle('border-bottom: 2px solid #0072ff');
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