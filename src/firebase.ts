// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  UserCredential
} from 'firebase/auth';
import { 
  getFirestore, 
  collection as firestoreCollection,
  doc, 
  setDoc, 
  getDoc, 
  getDocs as firestoreGetDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { SportsCenter, SportsCenterUser, Facility, TimeSlot, Booking, Promotion, StaffInvitation, Sport } from './types';

// Check if we're in a test or CI environment
const isTest = process.env.NODE_ENV === 'test';
const isCI = process.env.CI === 'true';
const isDev = process.env.NODE_ENV === 'development';
const shouldUseMockConfig = isTest || isCI || isDev;

console.log('Firebase config:', { isTest, isCI, isDev, shouldUseMockConfig });

// Define the type for signInWithGoogle function
type SignInWithGoogleFunction = () => Promise<User | null>;

// Mock data for development mode
const mockSports: Sport[] = [
  { id: 'basketball', name: 'Basketball', icon: 'basketball' },
  { id: 'volleyball', name: 'Volleyball', icon: 'volleyball' },
  { id: 'tennis', name: 'Tennis', icon: 'tennis' },
  { id: 'swimming', name: 'Swimming', icon: 'swimming' },
  { id: 'soccer', name: 'Soccer', icon: 'soccer' },
  { id: 'yoga', name: 'Yoga', icon: 'yoga' },
  { id: 'water-polo', name: 'Water Polo', icon: 'water-polo' },
  { id: 'diving', name: 'Diving', icon: 'diving' },
  { id: 'badminton', name: 'Badminton', icon: 'badminton' },
  { id: 'futsal', name: 'Futsal', icon: 'futsal' }
];

// Mock facilities for development mode
const mockFacilities: Facility[] = [
  {
    id: 'facility1',
    sportsCenterId: 'center1',
    name: 'Tennis Court 1',
    sportId: 'tennis',
    description: 'Professional tennis court with clay surface',
    capacity: 4,
    pricePerHour: 30,
    isIndoor: false,
    amenities: ['lights', 'seating']
  },
  {
    id: 'facility2',
    sportsCenterId: 'center1',
    name: 'Tennis Court 2',
    sportId: 'tennis',
    description: 'Professional tennis court with hard surface',
    capacity: 4,
    pricePerHour: 35,
    isIndoor: true,
    amenities: ['lights', 'seating', 'air-conditioning']
  },
  {
    id: 'facility3',
    sportsCenterId: 'center2',
    name: 'Basketball Court 1',
    sportId: 'basketball',
    description: 'Full-size basketball court',
    capacity: 10,
    pricePerHour: 40,
    isIndoor: true,
    amenities: ['lights', 'seating', 'scoreboard']
  },
  {
    id: 'facility4',
    sportsCenterId: 'center3',
    name: 'Swimming Pool',
    sportId: 'swimming',
    description: 'Olympic-size swimming pool',
    capacity: 20,
    pricePerHour: 50,
    isIndoor: true,
    amenities: ['lights', 'seating', 'lockers', 'showers']
  }
];

const mockSportsCenters: SportsCenter[] = [
  {
    id: 'sc1',
    name: 'Golden Gate Sports Complex',
    description: 'A premier sports facility in the heart of San Francisco',
    address: '123 Golden Gate Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    phone: '(415) 555-1234',
    email: 'info@goldengatesports.com',
    website: 'https://www.goldengatesports.com',
    photoURL: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ownerId: 'owner1',
    sports: mockSports.slice(0, 3),
    amenities: ['parking', 'showers', 'lockers', 'cafe'],
    openingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '18:00' }
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20'),
    staffIds: ['staff1', 'staff2'],
    location: { latitude: 37.7749, longitude: -122.4194 }
  },
  {
    id: 'sc2',
    name: 'LA Fitness Center',
    description: 'Modern fitness and sports center in Los Angeles',
    address: '456 Hollywood Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90028',
    phone: '(213) 555-6789',
    email: 'info@lafitness.com',
    website: 'https://www.lafitnesscenter.com',
    photoURL: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ownerId: 'owner2',
    sports: [mockSports[2], mockSports[0], mockSports[3], mockSports[5]],
    amenities: ['parking', 'showers', 'lockers', 'sauna', 'spa'],
    openingHours: {
      monday: { open: '05:00', close: '23:00' },
      tuesday: { open: '05:00', close: '23:00' },
      wednesday: { open: '05:00', close: '23:00' },
      thursday: { open: '05:00', close: '23:00' },
      friday: { open: '05:00', close: '23:00' },
      saturday: { open: '07:00', close: '22:00' },
      sunday: { open: '07:00', close: '20:00' }
    },
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-07-15'),
    staffIds: ['staff3', 'staff4'],
    location: { latitude: 34.0522, longitude: -118.2437 }
  },
  {
    id: 'sc3',
    name: 'Bay Area Tennis Club',
    description: 'Premier tennis facility with indoor and outdoor courts',
    address: '789 Bay Shore Dr',
    city: 'Oakland',
    state: 'CA',
    zipCode: '94612',
    phone: '(510) 555-9012',
    email: 'info@bayareatennis.com',
    website: 'https://www.bayareatennis.com',
    photoURL: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ownerId: 'owner3',
    sports: [mockSports[2]],
    amenities: ['parking', 'showers', 'pro shop', 'coaching'],
    openingHours: {
      monday: { open: '07:00', close: '21:00' },
      tuesday: { open: '07:00', close: '21:00' },
      wednesday: { open: '07:00', close: '21:00' },
      thursday: { open: '07:00', close: '21:00' },
      friday: { open: '07:00', close: '21:00' },
      saturday: { open: '08:00', close: '19:00' },
      sunday: { open: '08:00', close: '19:00' }
    },
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-08-10'),
    staffIds: ['staff5'],
    location: { latitude: 37.8044, longitude: -122.2711 }
  },
  {
    id: 'sc4',
    name: 'San Diego Aquatic Center',
    description: 'State-of-the-art swimming and water sports facility',
    address: '321 Ocean View Ave',
    city: 'San Diego',
    state: 'CA',
    zipCode: '92101',
    phone: '(619) 555-3456',
    email: 'info@sdaquatic.com',
    website: 'https://www.sdaquaticcenter.com',
    photoURL: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ownerId: 'owner4',
    sports: [mockSports[3], mockSports[6], mockSports[7]],
    amenities: ['parking', 'showers', 'lockers', 'cafe', 'pro shop'],
    openingHours: {
      monday: { open: '06:00', close: '20:00' },
      tuesday: { open: '06:00', close: '20:00' },
      wednesday: { open: '06:00', close: '20:00' },
      thursday: { open: '06:00', close: '20:00' },
      friday: { open: '06:00', close: '20:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '08:00', close: '18:00' }
    },
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-09-05'),
    staffIds: ['staff6', 'staff7'],
    location: { latitude: 32.7157, longitude: -117.1611 }
  },
  {
    id: 'sc5',
    name: 'Sacramento Sports Arena',
    description: 'Multi-purpose sports arena for various indoor sports',
    address: '654 Capitol Mall',
    city: 'Sacramento',
    state: 'CA',
    zipCode: '95814',
    phone: '(916) 555-7890',
    email: 'info@sacsports.com',
    website: 'https://www.sacsportsarena.com',
    photoURL: 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ownerId: 'owner5',
    sports: [mockSports[0], mockSports[1], mockSports[8], mockSports[9]],
    amenities: ['parking', 'showers', 'lockers', 'cafe', 'equipment rental'],
    openingHours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '09:00', close: '20:00' },
      sunday: { open: '09:00', close: '18:00' }
    },
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-10-01'),
    staffIds: ['staff8'],
    location: { latitude: 38.5816, longitude: -121.4944 }
  }
];

// Create mock time slots for the next 7 days
const createMockTimeSlots = (): TimeSlot[] => {
  const timeSlots: TimeSlot[] = [];
  
  // Create time slots for each facility for the next 7 days
  mockFacilities.forEach((facility: Facility) => {
    // Create slots for the next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      
      // Create slots from 8:00 to 22:00 with 1-hour intervals
      for (let hour = 8; hour < 22; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);
        
        // Make some slots unavailable randomly
        const isAvailable = Math.random() > 0.3; // 70% chance of being available
        
        timeSlots.push({
          id: `${facility.id}-${startTime.toISOString()}`,
          facilityId: facility.id,
          sportsCenterId: facility.sportsCenterId,
          startTime,
          endTime,
          price: facility.pricePerHour,
          isAvailable,
          isSpecialOffer: Math.random() > 0.8, // 20% chance of being a special offer
          specialOfferPrice: Math.random() > 0.8 ? facility.pricePerHour * 0.8 : undefined
        });
      }
    }
  });
  
  return timeSlots;
};

const mockTimeSlots = createMockTimeSlots();

// Declare variables to be exported
let auth: any;
let googleProvider: any;
let signInWithGoogle: SignInWithGoogleFunction;
let db: any;
let collection: typeof firestoreCollection;
let getDocs: typeof firestoreGetDocs;

// If in test/CI environment, use mock implementation
if (shouldUseMockConfig) {
  try {
    // Import mock implementation
    console.log('Loading mock Firebase implementation...');
    
    if (isTest) {
      // Use Jest mock for tests
      const mockFirebase = require('./__mocks__/firebase');
      console.log('Jest mock Firebase loaded successfully');
      
      // Assign mock objects to our variables
      auth = mockFirebase.auth;
      googleProvider = mockFirebase.googleProvider;
      signInWithGoogle = mockFirebase.signInWithGoogle;
      db = mockFirebase.db;
      collection = mockFirebase.collection;
      getDocs = mockFirebase.getDocs;
    } else {
      // Use simple mock for development
      console.log('Using simple mock Firebase implementation');
      
      // Assign mock objects to our variables
      auth = { 
        currentUser: null,
        onAuthStateChanged: (callback: (user: User | null) => void) => {
          callback(null);
          return () => {};
        },
        signOut: async () => Promise.resolve()
      };
      
      googleProvider = { setCustomParameters: () => {} };
      signInWithGoogle = async () => null;
      db = {};
      
      // Create mock collection function that matches the Firestore type
      collection = ((...args: any[]) => {
        return { id: 'mock-collection', path: args.join('/') };
      }) as typeof firestoreCollection;
      
      // Create mock getDocs function that matches the Firestore type
      getDocs = (async () => {
        return {
          forEach: () => {},
          docs: [],
          metadata: { 
            hasPendingWrites: false, 
            fromCache: false,
            isEqual: () => true
          },
          query: {} as any,
          size: 0,
          empty: true,
          docChanges: () => []
        } as any;
      }) as unknown as typeof firestoreGetDocs;
    }
    
    console.log('Mock Firebase functions assigned');
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

    db = {};
    
    collection = ((...args: any[]) => {
      return { id: 'mock-collection', path: args.join('/') };
    }) as typeof firestoreCollection;
    
    getDocs = (async () => {
      return {
        forEach: () => {},
        docs: [],
        metadata: { 
          hasPendingWrites: false, 
          fromCache: false,
          isEqual: () => true
        },
        query: {} as any,
        size: 0,
        empty: true,
        docChanges: () => []
      } as any;
    }) as unknown as typeof firestoreGetDocs;
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
  db = getFirestore(app);

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

// Firestore helper functions
const sportsCentersCollection = 'sportscenters';
const sportsCenterUsersCollection = 'sportscenterusers';
const facilitiesCollection = 'facilities';
const timeSlotsCollection = 'timeslots';
const bookingsCollection = 'bookings';
const promotionsCollection = 'promotions';

// Sports Center User functions
export const createSportsCenterUser = async (
  userId: string, 
  data: Omit<SportsCenterUser, 'id' | 'createdAt'>
): Promise<SportsCenterUser> => {
  const userRef = doc(db, sportsCenterUsersCollection, userId);
  
  // Ensure the status field is set
  const userData = {
    ...data,
    status: data.status || 'active' // Default to 'active' if not provided
  };
  
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp()
  });
  
  return {
    id: userId,
    ...userData,
    createdAt: new Date()
  };
};

export const getSportsCenterUser = async (userId: string): Promise<SportsCenterUser | null> => {
  const userRef = doc(db, sportsCenterUsersCollection, userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as SportsCenterUser;
  }
  
  return null;
};

// Sports Center functions
export const createSportsCenter = async (data: Omit<SportsCenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<SportsCenter> => {
  const sportsCenterRef = firestoreCollection(db, sportsCentersCollection);
  const now = new Date();
  
  const sportsCenterData: Omit<SportsCenter, 'id'> = {
    ...data,
    createdAt: now,
    updatedAt: now
  };
  
  const docRef = await addDoc(sportsCenterRef, sportsCenterData);
  return { ...sportsCenterData, id: docRef.id };
};

export const getSportsCenter = async (id: string): Promise<SportsCenter | null> => {
  const sportsCenterRef = doc(db, sportsCentersCollection, id);
  const sportsCenterSnap = await getDoc(sportsCenterRef);
  
  if (sportsCenterSnap.exists()) {
    return sportsCenterSnap.data() as SportsCenter;
  }
  
  return null;
};

export const getSportsCentersByOwner = async (ownerId: string): Promise<SportsCenter[]> => {
  const sportsCentersRef = firestoreCollection(db, sportsCentersCollection);
  const q = query(sportsCentersRef, where('ownerId', '==', ownerId));
  const querySnapshot = await firestoreGetDocs(q);
  
  const sportsCenters: SportsCenter[] = [];
  querySnapshot.forEach((doc) => {
    sportsCenters.push({ id: doc.id, ...doc.data() } as SportsCenter);
  });
  
  return sportsCenters;
};

export const updateSportsCenter = async (id: string, data: Partial<SportsCenter>): Promise<void> => {
  const sportsCenterRef = doc(db, sportsCentersCollection, id);
  await updateDoc(sportsCenterRef, { ...data, updatedAt: new Date() });
};

// Facility functions
export const createFacility = async (data: Omit<Facility, 'id'>): Promise<Facility> => {
  const facilitiesRef = firestoreCollection(db, facilitiesCollection);
  const docRef = await addDoc(facilitiesRef, data);
  return { ...data, id: docRef.id };
};

export const getFacilitiesBySportsCenter = async (sportsCenterId: string): Promise<Facility[]> => {
  const facilitiesRef = firestoreCollection(db, facilitiesCollection);
  const q = query(facilitiesRef, where('sportsCenterId', '==', sportsCenterId));
  const querySnapshot = await firestoreGetDocs(q);
  
  const facilities: Facility[] = [];
  querySnapshot.forEach((doc) => {
    facilities.push({ id: doc.id, ...doc.data() } as Facility);
  });
  
  return facilities;
};

// TimeSlot functions
export const createTimeSlot = async (data: Omit<TimeSlot, 'id'>): Promise<TimeSlot> => {
  const timeSlotsRef = firestoreCollection(db, timeSlotsCollection);
  const docRef = await addDoc(timeSlotsRef, data);
  return { ...data, id: docRef.id };
};

export const getTimeSlotsByFacility = async (facilityId: string): Promise<TimeSlot[]> => {
  const timeSlotsRef = firestoreCollection(db, timeSlotsCollection);
  const q = query(timeSlotsRef, where('facilityId', '==', facilityId));
  const querySnapshot = await firestoreGetDocs(q);
  
  const timeSlots: TimeSlot[] = [];
  querySnapshot.forEach((doc) => {
    timeSlots.push({ id: doc.id, ...doc.data() } as TimeSlot);
  });
  
  return timeSlots;
};

// Booking functions
export const getBookingsBySportsCenter = async (sportsCenterId: string): Promise<Booking[]> => {
  const bookingsRef = firestoreCollection(db, bookingsCollection);
  const q = query(bookingsRef, where('sportsCenterId', '==', sportsCenterId));
  const querySnapshot = await firestoreGetDocs(q);
  
  const bookings: Booking[] = [];
  querySnapshot.forEach((doc) => {
    bookings.push({ id: doc.id, ...doc.data() } as Booking);
  });
  
  return bookings;
};

// Promotion functions
export const createPromotion = async (data: Omit<Promotion, 'id'>): Promise<Promotion> => {
  const promotionsRef = firestoreCollection(db, promotionsCollection);
  const docRef = await addDoc(promotionsRef, data);
  return { ...data, id: docRef.id };
};

export const getPromotionsBySportsCenter = async (sportsCenterId: string): Promise<Promotion[]> => {
  const promotionsRef = firestoreCollection(db, promotionsCollection);
  const q = query(promotionsRef, where('sportsCenterId', '==', sportsCenterId));
  const querySnapshot = await firestoreGetDocs(q);
  
  const promotions: Promotion[] = [];
  querySnapshot.forEach((doc) => {
    promotions.push({ id: doc.id, ...doc.data() } as Promotion);
  });
  
  return promotions;
};

// Staff management functions
export const inviteStaffMember = async (
  sportsCenterId: string, 
  email: string, 
  invitedBy: string
): Promise<StaffInvitation> => {
  const invitationRef = firestoreCollection(db, 'staffInvitations');
  
  // Generate a unique token for the invitation
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Set expiration date to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  const invitationData: Omit<StaffInvitation, 'id'> = {
    sportsCenterId,
    email,
    invitedBy,
    invitedAt: new Date(),
    status: 'pending',
    token,
    expiresAt
  };
  
  const docRef = await addDoc(invitationRef, {
    ...invitationData,
    invitedAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt)
  });
  
  return {
    ...invitationData,
    id: docRef.id
  };
};

export const getStaffInvitations = async (sportsCenterId: string): Promise<StaffInvitation[]> => {
  const invitationsRef = firestoreCollection(db, 'staffInvitations');
  const q = query(invitationsRef, where('sportsCenterId', '==', sportsCenterId));
  const querySnapshot = await firestoreGetDocs(q);
  
  const invitations: StaffInvitation[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    invitations.push({
      id: doc.id,
      sportsCenterId: data.sportsCenterId,
      email: data.email,
      invitedBy: data.invitedBy,
      invitedAt: data.invitedAt.toDate(),
      status: data.status,
      token: data.token,
      expiresAt: data.expiresAt.toDate()
    });
  });
  
  return invitations;
};

export const revokeStaffAccess = async (sportsCenterId: string, userId: string): Promise<void> => {
  // Update the sports center to remove the staff member
  const sportsCenterRef = doc(db, 'sportsCenters', sportsCenterId);
  const sportsCenterDoc = await getDoc(sportsCenterRef);
  
  if (sportsCenterDoc.exists()) {
    const sportsCenterData = sportsCenterDoc.data();
    const staffIds = sportsCenterData.staffIds || [];
    
    // Remove the user ID from the staffIds array
    const updatedStaffIds = staffIds.filter((id: string) => id !== userId);
    
    await updateDoc(sportsCenterRef, {
      staffIds: updatedStaffIds
    });
  }
  
  // Update the user's status to revoked
  const userRef = doc(db, 'sportsCenterUsers', userId);
  await updateDoc(userRef, {
    status: 'revoked'
  });
};

export const acceptStaffInvitation = async (token: string, userId: string): Promise<SportsCenterUser> => {
  // Find the invitation with the given token
  const invitationsRef = firestoreCollection(db, 'staffInvitations');
  const q = query(invitationsRef, where('token', '==', token));
  const querySnapshot = await firestoreGetDocs(q);
  
  if (querySnapshot.empty) {
    throw new Error('Invalid invitation token');
  }
  
  const invitationDoc = querySnapshot.docs[0];
  const invitation = invitationDoc.data();
  
  // Check if the invitation is expired
  const expiresAt = invitation.expiresAt.toDate();
  if (expiresAt < new Date()) {
    throw new Error('Invitation has expired');
  }
  
  // Check if the invitation is still pending
  if (invitation.status !== 'pending') {
    throw new Error('Invitation has already been used or revoked');
  }
  
  // Update the invitation status
  await updateDoc(doc(db, 'staffInvitations', invitationDoc.id), {
    status: 'accepted'
  });
  
  // Create or update the sports center user
  const userRef = doc(db, 'sportsCenterUsers', userId);
  const userData = {
    email: invitation.email,
    displayName: auth.currentUser?.displayName || 'Staff Member',
    photoURL: auth.currentUser?.photoURL,
    role: 'staff' as const,
    sportsCenterId: invitation.sportsCenterId,
    invitedBy: invitation.invitedBy,
    status: 'active' as const
  };
  
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp()
  });
  
  // Add the user to the sports center's staff list
  const sportsCenterRef = doc(db, 'sportsCenters', invitation.sportsCenterId);
  const sportsCenterDoc = await getDoc(sportsCenterRef);
  
  if (sportsCenterDoc.exists()) {
    const sportsCenterData = sportsCenterDoc.data();
    const staffIds = sportsCenterData.staffIds || [];
    
    // Add the user ID to the staffIds array if not already present
    if (!staffIds.includes(userId)) {
      await updateDoc(sportsCenterRef, {
        staffIds: [...staffIds, userId]
      });
    }
  }
  
  return {
    id: userId,
    ...userData,
    createdAt: new Date()
  };
};

// Sports center discovery functions
export const getSportsCenters = async (): Promise<SportsCenter[]> => {
  if (shouldUseMockConfig) {
    console.log('Using mock getSportsCenters');
    return mockSportsCenters;
  }
  
  console.log('Using real getSportsCenters');
  const sportsCentersRef = firestoreCollection(db, 'sportsCenters');
  const querySnapshot = await firestoreGetDocs(sportsCentersRef);
  
  const sportsCenters: SportsCenter[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sportsCenters.push({
      id: doc.id,
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      phone: data.phone,
      email: data.email,
      website: data.website,
      photoURL: data.photoURL,
      coverPhotoURL: data.coverPhotoURL,
      location: data.location,
      sports: data.sports || [],
      amenities: data.amenities || [],
      openingHours: data.openingHours || {},
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      ownerId: data.ownerId,
      staffIds: data.staffIds || []
    });
  });
  
  return sportsCenters;
};

export const getSports = async (): Promise<Sport[]> => {
  if (shouldUseMockConfig) {
    console.log('Using mock getSports');
    return mockSports;
  }
  
  console.log('Using real getSports');
  const sportsRef = firestoreCollection(db, 'sports');
  const querySnapshot = await firestoreGetDocs(sportsRef);
  
  const sports: Sport[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sports.push({
      id: doc.id,
      name: data.name,
      icon: data.icon,
    });
  });
  
  return sports;
};

// Get time slots by sports center and date
export const getTimeSlotsBySportsCenterAndDate = async (
  sportsCenterId: string, 
  date: Date,
  startTime?: string,
  duration?: number
): Promise<TimeSlot[]> => {
  if (shouldUseMockConfig) {
    console.log('Using mock getTimeSlotsBySportsCenterAndDate');
    
    // Filter time slots by sports center and date
    let filteredTimeSlots = mockTimeSlots.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return (
        slot.sportsCenterId === sportsCenterId &&
        slotDate.getDate() === date.getDate() &&
        slotDate.getMonth() === date.getMonth() &&
        slotDate.getFullYear() === date.getFullYear()
      );
    });
    
    // Filter by start time if provided
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      filteredTimeSlots = filteredTimeSlots.filter(slot => {
        const slotHours = slot.startTime.getHours();
        const slotMinutes = slot.startTime.getMinutes();
        return slotHours >= hours && (slotHours > hours || slotMinutes >= minutes);
      });
    }
    
    // Filter by duration if provided
    if (duration) {
      // For now, we'll just return the slots as is since our mock data has 1-hour slots
      // In a real implementation, we would check if there are consecutive available slots
    }
    
    return filteredTimeSlots;
  }
  
  console.log('Using real getTimeSlotsBySportsCenterAndDate');
  const timeSlotsRef = firestoreCollection(db, 'timeSlots');
  
  // Create start and end of the day for the given date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Create query to get time slots for the given sports center and date
  const q = query(
    timeSlotsRef,
    where('sportsCenterId', '==', sportsCenterId),
    where('startTime', '>=', Timestamp.fromDate(startOfDay)),
    where('startTime', '<=', Timestamp.fromDate(endOfDay))
  );
  
  const querySnapshot = await firestoreGetDocs(q);
  
  const timeSlots: TimeSlot[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    timeSlots.push({
      id: doc.id,
      facilityId: data.facilityId,
      sportsCenterId: data.sportsCenterId,
      startTime: data.startTime.toDate(),
      endTime: data.endTime.toDate(),
      price: data.price,
      isAvailable: data.isAvailable,
      isSpecialOffer: data.isSpecialOffer,
      specialOfferPrice: data.specialOfferPrice
    });
  });
  
  // Filter by start time if provided
  if (startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    return timeSlots.filter(slot => {
      const slotHours = slot.startTime.getHours();
      const slotMinutes = slot.startTime.getMinutes();
      return slotHours >= hours && (slotHours > hours || slotMinutes >= minutes);
    });
  }
  
  return timeSlots;
};

// Export Firebase objects at the top level
export { auth, googleProvider, signInWithGoogle, db };