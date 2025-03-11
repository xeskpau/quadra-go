// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
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
const shouldUseMockConfig = isTest || isCI;

// Define the type for signInWithGoogle function
type SignInWithGoogleFunction = () => Promise<User | null>;

// Declare variables to be exported
let auth: any;
let googleProvider: any;
let signInWithGoogle: SignInWithGoogleFunction;
let db: any;

// If in test/CI environment, use mock implementation
if (shouldUseMockConfig) {
  try {
    // Import mock implementation
    const mockFirebase = require('./__mocks__/firebase');
    
    // Assign mock objects to our variables
    auth = mockFirebase.auth;
    googleProvider = mockFirebase.googleProvider;
    signInWithGoogle = mockFirebase.signInWithGoogle;
    db = mockFirebase.db;
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

    db = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: false, data: () => null }),
          set: async () => {},
          update: async () => {}
        }),
        add: async () => ({ id: 'mock-id' }),
        where: () => ({
          get: async () => ({
            docs: [],
            forEach: () => {}
          })
        })
      })
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
  const sportsCenterRef = collection(db, sportsCentersCollection);
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
  const sportsCentersRef = collection(db, sportsCentersCollection);
  const q = query(sportsCentersRef, where('ownerId', '==', ownerId));
  const querySnapshot = await getDocs(q);
  
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
  const facilitiesRef = collection(db, facilitiesCollection);
  const docRef = await addDoc(facilitiesRef, data);
  return { ...data, id: docRef.id };
};

export const getFacilitiesBySportsCenter = async (sportsCenterId: string): Promise<Facility[]> => {
  const facilitiesRef = collection(db, facilitiesCollection);
  const q = query(facilitiesRef, where('sportsCenterId', '==', sportsCenterId));
  const querySnapshot = await getDocs(q);
  
  const facilities: Facility[] = [];
  querySnapshot.forEach((doc) => {
    facilities.push({ id: doc.id, ...doc.data() } as Facility);
  });
  
  return facilities;
};

// TimeSlot functions
export const createTimeSlot = async (data: Omit<TimeSlot, 'id'>): Promise<TimeSlot> => {
  const timeSlotsRef = collection(db, timeSlotsCollection);
  const docRef = await addDoc(timeSlotsRef, data);
  return { ...data, id: docRef.id };
};

export const getTimeSlotsByFacility = async (facilityId: string): Promise<TimeSlot[]> => {
  const timeSlotsRef = collection(db, timeSlotsCollection);
  const q = query(timeSlotsRef, where('facilityId', '==', facilityId));
  const querySnapshot = await getDocs(q);
  
  const timeSlots: TimeSlot[] = [];
  querySnapshot.forEach((doc) => {
    timeSlots.push({ id: doc.id, ...doc.data() } as TimeSlot);
  });
  
  return timeSlots;
};

// Booking functions
export const getBookingsBySportsCenter = async (sportsCenterId: string): Promise<Booking[]> => {
  const bookingsRef = collection(db, bookingsCollection);
  const q = query(bookingsRef, where('sportsCenterId', '==', sportsCenterId));
  const querySnapshot = await getDocs(q);
  
  const bookings: Booking[] = [];
  querySnapshot.forEach((doc) => {
    bookings.push({ id: doc.id, ...doc.data() } as Booking);
  });
  
  return bookings;
};

// Promotion functions
export const createPromotion = async (data: Omit<Promotion, 'id'>): Promise<Promotion> => {
  const promotionsRef = collection(db, promotionsCollection);
  const docRef = await addDoc(promotionsRef, data);
  return { ...data, id: docRef.id };
};

export const getPromotionsBySportsCenter = async (sportsCenterId: string): Promise<Promotion[]> => {
  const promotionsRef = collection(db, promotionsCollection);
  const q = query(promotionsRef, where('sportsCenterId', '==', sportsCenterId));
  const querySnapshot = await getDocs(q);
  
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
  const invitationRef = collection(db, 'staffInvitations');
  
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
  const invitationsRef = collection(db, 'staffInvitations');
  const q = query(invitationsRef, where('sportsCenterId', '==', sportsCenterId));
  const querySnapshot = await getDocs(q);
  
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
  const invitationsRef = collection(db, 'staffInvitations');
  const q = query(invitationsRef, where('token', '==', token));
  const querySnapshot = await getDocs(q);
  
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
  const sportsCentersRef = collection(db, 'sportsCenters');
  const querySnapshot = await getDocs(sportsCentersRef);
  
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
      sports: data.sports,
      amenities: data.amenities,
      openingHours: data.openingHours,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      ownerId: data.ownerId,
      staffIds: data.staffIds || []
    });
  });
  
  return sportsCenters;
};

export const getSports = async (): Promise<Sport[]> => {
  const sportsRef = collection(db, 'sports');
  const querySnapshot = await getDocs(sportsRef);
  
  const sports: Sport[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sports.push({
      id: doc.id,
      name: data.name,
      icon: data.icon
    });
  });
  
  return sports;
};

// Export Firebase objects at the top level
export { auth, googleProvider, signInWithGoogle, db };