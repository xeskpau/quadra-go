import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock the auth context
jest.mock('../contexts/AuthContext', () => {
  const originalModule = jest.requireActual('../contexts/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      currentUser: null,
      userProfile: null,
      userRole: null,
      loading: false,
      signInWithGoogle: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      resetPassword: jest.fn(),
      updateUserRole: jest.fn()
    })
  };
});

// Mock the SportsCenterContext
jest.mock('../contexts/SportsCenterContext', () => {
  const originalModule = jest.requireActual('../contexts/SportsCenterContext');
  return {
    ...originalModule,
    useSportsCenter: () => ({
      sportsCenterUser: null,
      sportsCenters: [],
      currentSportsCenter: null,
      facilities: [],
      timeSlots: [],
      bookings: [],
      promotions: [],
      staffInvitations: [],
      analyticsData: null,
      loading: false,
      error: null,
      registerAsSportsCenter: jest.fn(),
      createNewSportsCenter: jest.fn(),
      updateExistingSportsCenter: jest.fn(),
      selectSportsCenter: jest.fn(),
      addFacility: jest.fn(),
      addTimeSlot: jest.fn(),
      addPromotion: jest.fn(),
      refreshBookings: jest.fn(),
      generateAnalytics: jest.fn(),
      inviteStaff: jest.fn(),
      revokeStaff: jest.fn(),
      acceptInvitation: jest.fn(),
      refreshStaffInvitations: jest.fn()
    })
  };
});

// Create a wrapper with mocked context
const renderWithAuth = (ui: React.ReactElement) => {
  return render(ui);
};

describe('App', () => {
  it('renders the application title and tagline', () => {
    renderWithAuth(<App />);
    // Use a more specific selector to get the title in the header
    const titleElement = screen.getByRole('heading', { name: 'QuadraGo' });
    expect(titleElement).toBeInTheDocument();
    
    // Use a more specific selector for the tagline
    const taglineElement = screen.getByText('Connect with sports centers near you');
    expect(taglineElement).toBeInTheDocument();
  });

  it('renders the welcome page with hero section', () => {
    renderWithAuth(<App />);
    const heroTitle = screen.getByRole('heading', { name: /Welcome to QuadraGo/i });
    expect(heroTitle).toBeInTheDocument();
    
    const userLoginButton = screen.getByTestId('user-login-button');
    const sportsCenterButton = screen.getByTestId('sports-center-login-button');
    
    expect(userLoginButton).toBeInTheDocument();
    expect(sportsCenterButton).toBeInTheDocument();
  });

  it('renders the features section with three cards', () => {
    renderWithAuth(<App />);
    
    // Check for feature titles
    const findNearbyTitle = screen.getByRole('heading', { name: /Find Nearby Facilities/i });
    const easyBookingTitle = screen.getByRole('heading', { name: /Easy Booking/i });
    const variousSportsTitle = screen.getByRole('heading', { name: /Various Sports/i });
    
    expect(findNearbyTitle).toBeInTheDocument();
    expect(easyBookingTitle).toBeInTheDocument();
    expect(variousSportsTitle).toBeInTheDocument();
  });

  it('renders the footer with copyright information', () => {
    renderWithAuth(<App />);
    const currentYear = new Date().getFullYear();
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveTextContent(new RegExp(`© ${currentYear} QuadraGo`, 'i'));
  });
  
  it('renders the login button when user is not logged in', () => {
    renderWithAuth(<App />);
    const loginButton = screen.getByTestId('login-button');
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveTextContent(/Log In/i);
  });

  it('displays login modal when login button is clicked', () => {
    renderWithAuth(<App />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
    
    // Click login button
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);
    
    // Modal should now be visible
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /User Login/i })).toBeInTheDocument();
  });
  
  it('closes login modal when clicking close button', () => {
    renderWithAuth(<App />);
    
    // Open the modal
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);
    
    // Modal should be visible
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    
    // Click the close button
    const closeButton = screen.getByTestId('close-modal-button');
    fireEvent.click(closeButton);
    
    // Modal should now be closed
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });
}); 