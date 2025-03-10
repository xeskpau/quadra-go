import React from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

// Mock the firebase auth functions
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn().mockImplementation(() => jest.fn()),
  sendPasswordResetEmail: jest.fn()
}));

// Mock the firebase module
jest.mock('../../firebase', () => ({
  auth: {},
  googleProvider: {}
}));

describe('AuthContext', () => {
  let mockUser: Partial<User>;
  
  beforeEach(() => {
    mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User'
    };
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  it('provides the auth context to children', () => {
    const TestComponent = () => {
      const auth = useAuth();
      return <div data-testid="auth-test">{auth ? 'Auth exists' : 'No auth'}</div>;
    };
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(getByTestId('auth-test')).toHaveTextContent('Auth exists');
  });
  
  it('provides signInWithGoogle function that works correctly', async () => {
    // Setup mock for successful sign in
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });
    
    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call signInWithGoogle
    let user;
    await act(async () => {
      user = await result.current.signInWithGoogle();
    });
    
    // Check function called with correct params
    expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
    
    // Check user returned
    expect(user).toEqual(mockUser);
  });
  
  it('handles signInWithGoogle errors', async () => {
    // Setup mock for failed sign in
    const mockError = new Error('Google sign in failed');
    (signInWithPopup as jest.Mock).mockRejectedValueOnce(mockError);
    
    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call signInWithGoogle
    let user;
    await act(async () => {
      user = await result.current.signInWithGoogle();
    });
    
    // Check error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error signing in with Google',
      mockError
    );
    
    // Check null was returned
    expect(user).toBeNull();
    
    // Restore console
    consoleSpy.mockRestore();
  });
  
  it('provides login function that works correctly', async () => {
    // Setup mock for successful login
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });
    
    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call login
    let user;
    await act(async () => {
      user = await result.current.login('test@example.com', 'password123');
    });
    
    // Check function called with correct params
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth, 'test@example.com', 'password123'
    );
    
    // Check user returned
    expect(user).toEqual(mockUser);
  });
  
  it('handles login errors', async () => {
    // Setup mock for failed login
    const mockError = new Error('Login failed');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);
    
    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call login and expect error
    await act(async () => {
      await expect(
        result.current.login('test@example.com', 'password123')
      ).rejects.toThrow('Login failed');
    });
    
    // Check error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error logging in',
      mockError
    );
    
    // Restore console
    consoleSpy.mockRestore();
  });
  
  it('provides register function that works correctly', async () => {
    // Setup mock for successful registration
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });
    
    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call register
    let user;
    await act(async () => {
      user = await result.current.register('test@example.com', 'password123');
    });
    
    // Check function called with correct params
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth, 'test@example.com', 'password123'
    );
    
    // Check user returned
    expect(user).toEqual(mockUser);
  });
  
  it('handles register errors', async () => {
    // Setup mock for failed registration
    const mockError = new Error('Registration failed');
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);
    
    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call register and expect error
    await act(async () => {
      await expect(
        result.current.register('test@example.com', 'password123')
      ).rejects.toThrow('Registration failed');
    });
    
    // Check error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error registering',
      mockError
    );
    
    // Restore console
    consoleSpy.mockRestore();
  });
  
  it('provides logout function that works correctly', async () => {
    // Setup mock for successful logout
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);
    
    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call logout
    await act(async () => {
      await result.current.logout();
    });
    
    // Check function called with correct params
    expect(signOut).toHaveBeenCalledWith(auth);
  });
  
  it('provides resetPassword function that works correctly', async () => {
    // Setup mock for successful password reset
    (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);
    
    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call resetPassword
    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });
    
    // Check function called with correct params
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'test@example.com');
  });
}); 