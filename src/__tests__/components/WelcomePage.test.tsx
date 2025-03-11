import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import WelcomePage from '../../components/WelcomePage';

// Mock the react-router-dom useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('WelcomePage Component', () => {
  // Mock navigate function
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null
    });
  });
  
  test('renders welcome page correctly for non-logged in users', () => {
    render(<WelcomePage />);
    
    // Check if the title is rendered
    expect(screen.getByText('Welcome to QuadraGo')).toBeInTheDocument();
    
    // Check if login buttons are rendered for non-logged in users
    expect(screen.getByTestId('user-login-button')).toBeInTheDocument();
    expect(screen.getByTestId('sports-center-login-button')).toBeInTheDocument();
  });
  
  test('renders welcome page correctly for logged in users', () => {
    // Mock logged in user
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: 'user1', email: 'user@example.com' }
    });
    
    render(<WelcomePage />);
    
    // Check if the title is rendered
    expect(screen.getByText('Welcome to QuadraGo')).toBeInTheDocument();
    
    // Check if only explore button is rendered for logged in users
    expect(screen.getByTestId('explore-button')).toBeInTheDocument();
    expect(screen.queryByTestId('user-login-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sports-center-login-button')).not.toBeInTheDocument();
  });
  
  test('navigates to user login page when user login button is clicked', () => {
    render(<WelcomePage />);
    
    // Find and click the user login button
    const userLoginButton = screen.getByTestId('user-login-button');
    fireEvent.click(userLoginButton);
    
    // Check if navigate was called with the correct path and state
    expect(mockNavigate).toHaveBeenCalledWith('/login', { state: { role: 'user' } });
  });
  
  test('navigates to sports center login page when sports center login button is clicked', () => {
    render(<WelcomePage />);
    
    // Find and click the sports center login button
    const sportsCenterLoginButton = screen.getByTestId('sports-center-login-button');
    fireEvent.click(sportsCenterLoginButton);
    
    // Check if navigate was called with the correct path and state
    expect(mockNavigate).toHaveBeenCalledWith('/login', { state: { role: 'sports_center_admin' } });
  });
  
  test('navigates to discover page when explore button is clicked', () => {
    // Mock logged in user to show the explore button
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: 'user1', email: 'user@example.com' }
    });
    
    render(<WelcomePage />);
    
    // Find and click the explore button
    const exploreButton = screen.getByTestId('explore-button');
    fireEvent.click(exploreButton);
    
    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/discover');
  });
}); 