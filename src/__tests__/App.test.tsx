import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the application title and tagline', () => {
    render(<App />);
    const titleElement = screen.getByRole('heading', { level: 1, name: /QuadraGo/i });
    expect(titleElement).toBeInTheDocument();
    
    const taglineElement = screen.getByText(/Connect with sports centers near you/i);
    expect(taglineElement).toBeInTheDocument();
  });

  it('renders the hero section with call to action', () => {
    render(<App />);
    const heroTitle = screen.getByRole('heading', { level: 2, name: /Find and Book Sports Facilities with Ease/i });
    expect(heroTitle).toBeInTheDocument();
    
    const ctaButton = screen.getByRole('button', { name: /Get Started/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it('renders the features section with three cards', () => {
    render(<App />);
    
    // Check for feature titles
    const findNearbyTitle = screen.getByRole('heading', { name: /Find Nearby Facilities/i });
    const easyBookingTitle = screen.getByRole('heading', { name: /Easy Booking/i });
    const findPlayersTitle = screen.getByRole('heading', { name: /Find Players/i });
    
    expect(findNearbyTitle).toBeInTheDocument();
    expect(easyBookingTitle).toBeInTheDocument();
    expect(findPlayersTitle).toBeInTheDocument();
  });

  it('renders the footer with copyright information', () => {
    render(<App />);
    const currentYear = new Date().getFullYear();
    const footerText = screen.getByText(new RegExp(`© ${currentYear} QuadraGo. All rights reserved.`, 'i'));
    expect(footerText).toBeInTheDocument();
  });
}); 