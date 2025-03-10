import { auth, googleProvider, signInWithGoogle } from '../firebase';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({})
}));

jest.mock('firebase/auth', () => {
  const mockCredential = { token: 'mock-token', accessToken: 'mock-access-token' };
  const mockUser = { 
    uid: 'test-uid', 
    email: 'test@example.com',
    displayName: 'Test User'
  };
  
  // Create a properly typed mock constructor
  const MockGoogleAuthProvider = jest.fn().mockImplementation(() => ({
    setCustomParameters: jest.fn()
  }));
  
  // Extend the mock with static methods
  const extendedProvider = Object.assign(MockGoogleAuthProvider, {
    credentialFromResult: jest.fn().mockReturnValue(mockCredential),
    credentialFromError: jest.fn().mockReturnValue(null)
  });
  
  return {
    getAuth: jest.fn().mockReturnValue({}),
    GoogleAuthProvider: extendedProvider,
    signInWithPopup: jest.fn().mockResolvedValue({ 
      user: mockUser,
      _tokenResponse: {},
      operationType: 'signIn'
    })
  };
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    removeItem: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn()
  }
});

describe('Firebase Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('exports firebase related objects', () => {
    // Verify that our module exports the expected objects
    expect(auth).toBeDefined();
    expect(googleProvider).toBeDefined();
  });
  
  describe('signInWithGoogle', () => {
    it('successfully signs in with Google', async () => {
      const user = await signInWithGoogle();
      
      // Check that sessionStorage was accessed to clear OAuth cache
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('firebase:pendingRedirect');
      
      // Check that signInWithPopup was called with correct parameters
      expect(signInWithPopup).toHaveBeenCalled();
      
      // Check that credential was fetched from result
      expect(GoogleAuthProvider.credentialFromResult).toHaveBeenCalled();
      
      // Check that a user is returned
      expect(user).toBeDefined();
    });
    
    it('handles sign in errors correctly', async () => {
      // Mock signInWithPopup to reject with an error
      const mockError = new Error('Sign in failed');
      (mockError as any).code = 'auth/popup-closed-by-user';
      (mockError as any).customData = { email: 'test@example.com' };
      
      (signInWithPopup as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Mock console.error to avoid cluttering test output
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Test that the function throws the error
      await expect(signInWithGoogle()).rejects.toThrow('Sign in failed');
      
      // Check that error details were logged
      expect(console.error).toHaveBeenCalledWith(
        'Error signing in with Google:',
        expect.objectContaining({
          errorCode: 'auth/popup-closed-by-user',
          email: 'test@example.com'
        })
      );
      
      // Check that credentialFromError was called
      expect(GoogleAuthProvider.credentialFromError).toHaveBeenCalledWith(mockError);
      
      // Restore console.error
      console.error = originalConsoleError;
    });
    
    it('returns null when credential is not available', async () => {
      // Mock credentialFromResult to return null (failure case)
      (GoogleAuthProvider.credentialFromResult as jest.Mock).mockReturnValueOnce(null);
      
      // Mock console.error to avoid cluttering test output
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      const user = await signInWithGoogle();
      
      // Check that error was logged
      expect(console.error).toHaveBeenCalledWith(
        'Failed to get credential from Google sign-in result'
      );
      
      // Check that null is returned
      expect(user).toBeNull();
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });
}); 