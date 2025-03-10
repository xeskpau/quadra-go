// Mock implementation of Firebase for testing
import { User } from 'firebase/auth';

// Create a mock user
const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
  emailVerified: true,
  // Add other required properties
  providerId: 'firebase',
  isAnonymous: false,
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  phoneNumber: null,
  providerData: [],
  metadata: {
    creationTime: '2023-01-01T00:00:00Z',
    lastSignInTime: '2023-01-01T00:00:00Z'
  },
  delete: async () => Promise.resolve(),
  getIdToken: async () => Promise.resolve('mock-id-token'),
  getIdTokenResult: async () => Promise.resolve({
    token: 'mock-id-token',
    claims: {},
    expirationTime: '',
    issuedAtTime: '',
    authTime: '',
    signInProvider: null,
    signInSecondFactor: null
  }),
  reload: async () => Promise.resolve(),
  toJSON: () => ({})
} as User;

// Mock auth object
const auth = {
  currentUser: mockUser,
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    callback(mockUser);
    return () => {};
  },
  signOut: async () => Promise.resolve()
};

// Mock Google provider
const googleProvider = {
  setCustomParameters: () => {}
};

// Mock sign in with Google function
const signInWithGoogle = async (): Promise<User | null> => {
  return mockUser;
};

export { auth, googleProvider, signInWithGoogle }; 