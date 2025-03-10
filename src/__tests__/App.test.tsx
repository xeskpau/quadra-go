import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock the auth context
jest.mock('../contexts/AuthContext', () => {
  const originalModule = jest.requireActual('../contexts/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      currentUser: null,
      loading: false,
      signInWithGoogle: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      resetPassword: jest.fn()
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
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent(/QuadraGo/i);
    
    const taglineElement = screen.getByText(/Connect with sports centers near you/i);
    expect(taglineElement).toBeInTheDocument();
  });

  it('renders the hero section with call to action', () => {
    renderWithAuth(<App />);
    const heroTitle = screen.getByRole('heading', { level: 2 });
    expect(heroTitle).toHaveTextContent(/Find and Book Sports Facilities with Ease/i);
    
    const ctaButton = screen.getByRole('button', { name: /Get Started/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it('renders the features section with three cards', () => {
    renderWithAuth(<App />);
    
    // Check for feature titles - use more specific selectors
    const findNearbyTitle = screen.getByRole('heading', { name: /Find Nearby Facilities/i });
    const easyBookingTitle = screen.getByRole('heading', { name: /Easy Booking/i });
    const findPlayersTitle = screen.getByRole('heading', { name: /Find Players/i });
    
    expect(findNearbyTitle).toBeInTheDocument();
    expect(easyBookingTitle).toBeInTheDocument();
    expect(findPlayersTitle).toBeInTheDocument();
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
}); 