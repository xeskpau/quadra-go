import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Check if we're in a test environment
const isTest = process.env.NODE_ENV === 'test';

// For test environment, use mock config
// For production, replace with actual Firebase config
const firebaseConfig = {
  apiKey: isTest ? "test-api-key" : "YOUR_API_KEY",
  authDomain: isTest ? "test-project-id.firebaseapp.com" : "your-project-id.firebaseapp.com",
  projectId: isTest ? "test-project-id" : "your-project-id",
  storageBucket: isTest ? "test-project-id.appspot.com" : "your-project-id.appspot.com",
  messagingSenderId: isTest ? "123456789" : "YOUR_MESSAGING_SENDER_ID",
  appId: isTest ? "1:123456789:web:abcdef" : "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider }; 