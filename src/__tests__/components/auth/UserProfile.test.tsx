import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '../../../components/auth/UserProfile';
import { useAuth } from '../../../contexts/AuthContext';

// Mock the auth context hook
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('UserProfile Component', () => {
  // Common mock setup
  const mockLogout = jest.fn().mockResolvedValue(undefined);
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  it('renders user avatar with initials when no photo URL is available', () => {
    // Setup mock
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Test User',
        email: 'test@example.com'
      },
      logout: mockLogout
    });
    
    render(<UserProfile />);
    
    // Find avatar element with initials
    const avatarElement = screen.getByTestId('user-avatar-initials');
    
    // Check initials are displayed
    expect(avatarElement).toHaveTextContent('TU');
  });
  
  it('renders user avatar with photo when photo URL is available', () => {
    // Setup mock with photo URL
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: 'https://example.com/photo.jpg'
      },
      logout: mockLogout
    });
    
    render(<UserProfile />);
    
    // Check that we have the photo avatar (not the initials avatar)
    expect(screen.getByTestId('user-avatar-photo')).toBeInTheDocument();
    expect(screen.queryByTestId('user-avatar-initials')).not.toBeInTheDocument();
  });
  
  it('opens dropdown when profile button is clicked', () => {
    // Setup mock
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Test User',
        email: 'test@example.com'
      },
      logout: mockLogout
    });
    
    render(<UserProfile />);
    
    // Dropdown should not be visible initially
    expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    
    // Click the profile button
    fireEvent.click(screen.getByTestId('profile-button'));
    
    // Dropdown should now be visible
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    
    // Check user info is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
  
  it('closes dropdown when clicking outside', async () => {
    // Setup mock
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Test User',
        email: 'test@example.com'
      },
      logout: mockLogout
    });
    
    // Create a wrapper div to simulate clicking outside
    const { container } = render(
      <div data-testid="outside">
        <UserProfile />
      </div>
    );
    
    // Open the dropdown
    fireEvent.click(screen.getByTestId('profile-button'));
    
    // Dropdown should be visible
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    
    // Click outside the dropdown (on the container)
    fireEvent.click(container.firstChild as Element);
    
    // Dropdown should now be closed
    await waitFor(() => {
      expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    });
  });
  
  it('closes dropdown when a menu item is clicked', async () => {
    // Setup mock
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Test User',
        email: 'test@example.com'
      },
      logout: mockLogout
    });
    
    render(<UserProfile />);
    
    // Open the dropdown
    fireEvent.click(screen.getByTestId('profile-button'));
    
    // Click the "My Profile" menu item
    fireEvent.click(screen.getByTestId('profile-link'));
    
    // Dropdown should now be closed
    await waitFor(() => {
      expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    });
  });
  
  it('calls logout when logout button is clicked', async () => {
    // Setup mock
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Test User',
        email: 'test@example.com'
      },
      logout: mockLogout
    });
    
    render(<UserProfile />);
    
    // Open the dropdown
    fireEvent.click(screen.getByTestId('profile-button'));
    
    // Click the logout button
    fireEvent.click(screen.getByTestId('logout-button'));
    
    // Check logout was called
    expect(mockLogout).toHaveBeenCalled();
    
    // Dropdown should be closed after logout
    await waitFor(() => {
      expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    });
  });
  
  it('displays a placeholder when user has no display name', () => {
    // Setup mock with no display name
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        email: 'test@example.com'
      },
      logout: mockLogout
    });
    
    render(<UserProfile />);
    
    // Open the dropdown
    fireEvent.click(screen.getByTestId('profile-button'));
    
    // Check the default "User" name is displayed
    expect(screen.getByText('User')).toBeInTheDocument();
  });
  
  it('handles logout errors gracefully', async () => {
    // Setup mock that throws error on logout
    const mockErrorLogout = jest.fn().mockRejectedValue(new Error('Logout failed'));
    
    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Test User',
        email: 'test@example.com'
      },
      logout: mockErrorLogout
    });
    
    render(<UserProfile />);
    
    // Open the dropdown
    fireEvent.click(screen.getByTestId('profile-button'));
    
    // Click the logout button
    fireEvent.click(screen.getByTestId('logout-button'));
    
    // Wait for async error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to log out', 
        expect.any(Error)
      );
    });
    
    // Restore console
    consoleSpy.mockRestore();
  });
  
  it('displays a question mark when user has no display name for avatar initials', () => {
    // Setup mock with no display name
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        email: 'test@example.com'
      },
      logout: mockLogout
    });
    
    render(<UserProfile />);
    
    // Find avatar element
    const avatarElement = screen.getByTestId('user-avatar-initials');
    
    // Check question mark is displayed as fallback
    expect(avatarElement).toHaveTextContent('?');
  });
}); 