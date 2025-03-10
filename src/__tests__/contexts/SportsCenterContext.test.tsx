import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SportsCenterProvider, useSportsCenter } from '../../contexts/SportsCenterContext';
import { AuthProvider } from '../../contexts/AuthContext';
import * as firebase from '../../firebase';

// Mock the firebase module
jest.mock('../../firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
    },
    onAuthStateChanged: (callback: (user: any) => void) => {
      callback({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
      });
      return () => {};
    },
  },
  getSportsCenterUser: jest.fn(),
  createSportsCenterUser: jest.fn(),
  getSportsCentersByOwner: jest.fn(),
  createSportsCenter: jest.fn(),
  updateSportsCenter: jest.fn(),
  getSportsCenter: jest.fn(),
  createFacility: jest.fn(),
  getFacilitiesBySportsCenter: jest.fn(),
  createTimeSlot: jest.fn(),
  getTimeSlotsByFacility: jest.fn(),
  getBookingsBySportsCenter: jest.fn(),
  createPromotion: jest.fn(),
  getPromotionsBySportsCenter: jest.fn(),
}));

// Test component that uses the SportsCenterContext
const TestComponent = () => {
  const { 
    sportsCenterUser, 
    sportsCenters, 
    currentSportsCenter,
    loading, 
    error,
    registerAsSportsCenter
  } = useSportsCenter();

  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading...' : 'Not loading'}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <div data-testid="user">{sportsCenterUser ? sportsCenterUser.displayName : 'No user'}</div>
      <div data-testid="centers-count">{sportsCenters.length}</div>
      <div data-testid="current-center">{currentSportsCenter ? currentSportsCenter.name : 'No center'}</div>
      <button 
        data-testid="register-button" 
        onClick={() => registerAsSportsCenter('Test Sports Center', 'admin')}
      >
        Register
      </button>
    </div>
  );
};

describe('SportsCenterContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides loading state initially', () => {
    render(
      <AuthProvider>
        <SportsCenterProvider>
          <TestComponent />
        </SportsCenterProvider>
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
  });

  test('loads user data when auth state changes', async () => {
    // Mock the getSportsCenterUser function to return a user
    (firebase.getSportsCenterUser as jest.Mock).mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test Sports Center',
      role: 'admin',
      createdAt: new Date(),
    });

    // Mock the getSportsCentersByOwner function to return centers
    (firebase.getSportsCentersByOwner as jest.Mock).mockResolvedValue([
      {
        id: 'center1',
        name: 'Test Sports Center',
        description: 'A test sports center',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        phone: '123-456-7890',
        email: 'info@test.com',
        location: { latitude: 34.0522, longitude: -118.2437 },
        sports: [],
        amenities: [],
        openingHours: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 'test-user-id',
        staffIds: [],
      },
    ]);

    render(
      <AuthProvider>
        <SportsCenterProvider>
          <TestComponent />
        </SportsCenterProvider>
      </AuthProvider>
    );

    // Wait for the loading state to change
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    // Check that the user and centers are loaded
    expect(screen.getByTestId('user')).toHaveTextContent('Test Sports Center');
    expect(screen.getByTestId('centers-count')).toHaveTextContent('1');
  });

  test('registers a new sports center user', async () => {
    // Mock the createSportsCenterUser function to return a user
    (firebase.createSportsCenterUser as jest.Mock).mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'New Sports Center',
      role: 'admin',
      createdAt: new Date(),
    });

    render(
      <AuthProvider>
        <SportsCenterProvider>
          <TestComponent />
        </SportsCenterProvider>
      </AuthProvider>
    );

    // Wait for the loading state to change
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    // Click the register button
    await act(async () => {
      fireEvent.click(screen.getByTestId('register-button'));
    });

    // Check that the createSportsCenterUser function was called
    expect(firebase.createSportsCenterUser).toHaveBeenCalledWith(
      'test-user-id',
      {
        displayName: 'Test Sports Center',
        email: 'test@example.com',
        role: 'admin',
        photoURL: undefined,
      }
    );

    // Check that the user is updated
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('New Sports Center');
    });
  });

  test('handles errors gracefully', async () => {
    // Mock the getSportsCenterUser function to throw an error
    (firebase.getSportsCenterUser as jest.Mock).mockRejectedValue(new Error('Test error'));

    render(
      <AuthProvider>
        <SportsCenterProvider>
          <TestComponent />
        </SportsCenterProvider>
      </AuthProvider>
    );

    // Wait for the loading state to change
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    // Check that the error is displayed
    expect(screen.getByTestId('error')).toHaveTextContent('Failed to load sports center data');
  });
}); 