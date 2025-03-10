import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../components/auth/Login';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(() => Promise.resolve()),
    register: jest.fn(() => Promise.resolve()),
    signInWithGoogle: jest.fn(() => Promise.resolve()),
    resetPassword: jest.fn(() => Promise.resolve()),
    currentUser: null
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('Login Component', () => {
  test('renders login form by default', () => {
    render(<Login />);
    
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Log In');
    expect(screen.getByTestId('google-button')).toBeInTheDocument();
  });
  
  test('switches between login and signup forms', () => {
    render(<Login />);
    
    // Initial state should be login
    expect(screen.getByText('Log In')).toBeInTheDocument();
    
    // Click to switch to signup
    fireEvent.click(screen.getByTestId('toggle-form-button'));
    
    // Should now be in signup mode
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Sign Up');
    
    // Click to switch back to login
    fireEvent.click(screen.getByTestId('toggle-form-button'));
    
    // Should be back in login mode
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });
  
  test('shows forgot password option in login mode', () => {
    render(<Login />);
    
    // Should show forgot password in login mode
    expect(screen.getByTestId('forgot-password-button')).toBeInTheDocument();
    
    // Switch to signup mode
    fireEvent.click(screen.getByTestId('toggle-form-button'));
    
    // Forgot password should not be visible in signup mode
    expect(screen.queryByTestId('forgot-password-button')).not.toBeInTheDocument();
  });
  
  test('handles form submission', async () => {
    render(<Login />);
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Should show loading state and then success message
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });
  
  test('handles Google sign-in', async () => {
    render(<Login />);
    
    // Click the Google button
    fireEvent.click(screen.getByTestId('google-button'));
    
    // Should show loading state and then success message
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });
}); 