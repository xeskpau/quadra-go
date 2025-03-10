// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

// Check if we're in a test or CI environment
const isTest = process.env.NODE_ENV === 'test';
const isCI = process.env.CI === 'true';
const shouldUseMockConfig = isTest || isCI;

// Define the type for signInWithGoogle function
type SignInWithGoogleFunction = () => Promise<User | null>;

// Declare variables to be exported
let auth: any;
let googleProvider: any;
let signInWithGoogle: SignInWithGoogleFunction;

// If in test/CI environment, use mock implementation
if (shouldUseMockConfig) {
  try {
    // Import mock implementation
    const mockFirebase = require('./__mocks__/firebase');
    
    // Assign mock objects to our variables
    auth = mockFirebase.auth;
    googleProvider = mockFirebase.googleProvider;
    signInWithGoogle = mockFirebase.signInWithGoogle;
  } catch (error) {
    console.warn('Failed to load mock Firebase implementation:', error);
    
    // Provide fallback mock implementation
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback: (user: User | null) => void) => {
        callback(null);
        return () => {};
      },
      signOut: async () => Promise.resolve()
    };
    
    googleProvider = {
      setCustomParameters: () => {}
    };
    
    signInWithGoogle = async (): Promise<User | null> => {
      console.log('Using fallback mock signInWithGoogle');
      return null;
    };
  }
} else {
  // For production, use real Firebase implementation
  
  // Firebase configuration from environment variables
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  // Configure Google Auth Provider
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    ux_mode: 'popup'
  });

  // Helper function for Google sign-in
  signInWithGoogle = async (): Promise<User | null> => {
    try {
      // Clear any existing OAuth error cache
      sessionStorage.removeItem('firebase:pendingRedirect');
      
      // Use signInWithPopup to create a popup experience
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get credentials for Google Access
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential) {
        console.error('Failed to get credential from Google sign-in result');
        return null;
      }
      
      // Successfully authenticated
      return result.user;
    } catch (error: any) {
      // Handle errors by logging more detailed information
      const errorCode = error.code;
      const errorMessage = error.message;
      
      // Auth provider email that failed
      const email = error.customData?.email || '';
      
      // The AuthCredential that was used for this sign-in attempt
      const credential = GoogleAuthProvider.credentialFromError(error);
      
      console.error('Error signing in with Google:', { 
        errorCode, 
        errorMessage, 
        email, 
        credential 
      });
      
      throw error;
    }
  };
}

// Export Firebase objects at the top level
export { auth, googleProvider, signInWithGoogle };