import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

// Check if we're in a test environment
const isTest = process.env.NODE_ENV === 'test';

// For test environment, use mock config
// For production, use proper Firebase config
const firebaseConfig = {
  apiKey: isTest ? "test-api-key" : "AIzaSyD5s1v3xijHWzqBTjOMowzUT7jxWzcMo1I",
  authDomain: isTest ? "test-project-id.firebaseapp.com" : "central-embassy-346301.firebaseapp.com",
  projectId: isTest ? "test-project-id" : "central-embassy-346301",
  storageBucket: isTest ? "test-project-id.appspot.com" : "central-embassy-346301.firebasestorage.app",
  messagingSenderId: isTest ? "123456789" : "118900547313",
  appId: isTest ? "1:123456789:web:abcdef" : "1:118900547313:web:f50fa6e093f5ad5dda9350",
  measurementId: isTest ? "" : "G-MSNFVBL38M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider - Add these settings to ensure the prompt appears
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add login_hint if you want to suggest a specific account
  // login_hint: 'user@gmail.com'
  
  // Enable one-tap sign-in if running in development/production
  ...(isTest ? {} : { ux_mode: 'popup' })
});

// Helper function for Google sign-in
const signInWithGoogle = async (): Promise<User | null> => {
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
    // AuthenticationError: error.code === 'auth/popup-closed-by-user' when user closes popup
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

export { auth, googleProvider, signInWithGoogle };