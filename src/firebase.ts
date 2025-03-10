import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

// Check if we're in a test environment
const isTest = process.env.NODE_ENV === 'test';

// For test environment, use mock config
// For production, use environment variables
const firebaseConfig = {
  apiKey: isTest ? "test-api-key" : process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: isTest ? "test-project-id.firebaseapp.com" : process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: isTest ? "test-project-id" : process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: isTest ? "test-project-id.appspot.com" : process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: isTest ? "123456789" : process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: isTest ? "1:123456789:web:abcdef" : process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: isTest ? "" : process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider - Add these settings to ensure the prompt appears
// Only call setCustomParameters if not in test environment
if (!isTest) {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    // Add login_hint if you want to suggest a specific account
    // login_hint: 'user@gmail.com'
    ux_mode: 'popup'
  });
}

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