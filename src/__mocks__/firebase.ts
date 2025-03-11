// Mock Firebase implementation for tests

// Define the user type
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: null;
  password: string;
}

// Define the sports center user type
interface MockSportsCenterUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: Date;
}

// Mock users with index signature
const mockUsers: { [email: string]: MockUser } = {
  // Regular users
  'user@example.com': {
    uid: 'user-123',
    email: 'user@example.com',
    displayName: 'Regular User',
    photoURL: null,
    password: 'User123!'
  },
  'premium@example.com': {
    uid: 'premium-123',
    email: 'premium@example.com',
    displayName: 'Premium User',
    photoURL: null,
    password: 'Premium123!'
  },
  // Sports center users
  'admin@lasportscomplex.com': {
    uid: 'sc-la-123',
    email: 'admin@lasportscomplex.com',
    displayName: 'Los Angeles Sports Complex',
    photoURL: null,
    password: 'LAcomplex123'
  },
  'admin@sfsportshub.com': {
    uid: 'sc-sf-123',
    email: 'admin@sfsportshub.com',
    displayName: 'San Francisco Sports Hub',
    photoURL: null,
    password: 'SFhub123'
  },
  'admin@sdathleticcenter.com': {
    uid: 'sc-sd-123',
    email: 'admin@sdathleticcenter.com',
    displayName: 'San Diego Athletic Center',
    photoURL: null,
    password: 'SDcenter123'
  },
  'admin@sacsportsarena.com': {
    uid: 'sc-sac-123',
    email: 'admin@sacsportsarena.com',
    displayName: 'Sacramento Sports Arena',
    photoURL: null,
    password: 'SACarena123'
  },
  'admin@sjsportspavilion.com': {
    uid: 'sc-sj-123',
    email: 'admin@sjsportspavilion.com',
    displayName: 'San Jose Sports Pavilion',
    photoURL: null,
    password: 'SJpavilion123'
  },
  'admin@fresnosportsclub.com': {
    uid: 'sc-fresno-123',
    email: 'admin@fresnosportsclub.com',
    displayName: 'Fresno Sports Club',
    photoURL: null,
    password: 'Fresnoclub123'
  },
  'admin@lbsportscenter.com': {
    uid: 'sc-lb-123',
    email: 'admin@lbsportscenter.com',
    displayName: 'Long Beach Sports Center',
    photoURL: null,
    password: 'LBcenter123'
  },
  'admin@oaklandathleticclub.com': {
    uid: 'sc-oak-123',
    email: 'admin@oaklandathleticclub.com',
    displayName: 'Oakland Athletic Club',
    photoURL: null,
    password: 'OAKclub123'
  },
  'admin@bakersfieldcomplex.com': {
    uid: 'sc-bak-123',
    email: 'admin@bakersfieldcomplex.com',
    displayName: 'Bakersfield Sports Complex',
    photoURL: null,
    password: 'BAKcomplex123'
  },
  'admin@anaheimsportscenter.com': {
    uid: 'sc-ana-123',
    email: 'admin@anaheimsportscenter.com',
    displayName: 'Anaheim Sports Center',
    photoURL: null,
    password: 'ANAcenter123'
  }
};

// Mock sports center users with index signature
const mockSportsCenterUsers: { [userId: string]: MockSportsCenterUser } = {
  'user-123': {
    id: 'user-123',
    email: 'user@example.com',
    displayName: 'Regular User',
    role: 'admin',
    createdAt: new Date(),
  },
  'premium-123': {
    id: 'premium-123',
    email: 'premium@example.com',
    displayName: 'Premium User',
    role: 'admin',
    createdAt: new Date(),
  },
  'sc-la-123': {
    id: 'sc-la-123',
    email: 'admin@lasportscomplex.com',
    displayName: 'Los Angeles Sports Complex',
    role: 'admin',
    createdAt: new Date(),
  },
  'test-user-id': {
    id: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test Sports Center',
    role: 'admin',
    createdAt: new Date(),
  }
};

// Mock sports centers
const mockSportsCenters = [
  {
    id: 'sc-la-1',
    name: 'Los Angeles Sports Complex',
    description: 'A premier sports facility in LA',
    address: '123 LA St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    phone: '123-456-7890',
    email: 'info@lasportscomplex.com',
    location: { latitude: 34.0522, longitude: -118.2437 },
    sports: [{ id: 'sport1', name: 'Tennis', icon: '🎾' }],
    amenities: ['Parking', 'Showers'],
    openingHours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-la-123',
    staffIds: [],
  },
  {
    id: 'mock-id',
    name: 'Mock Sports Center',
    description: 'A mock sports center for testing',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    phone: '123-456-7890',
    email: 'info@mocksportscenter.com',
    location: { latitude: 34.0522, longitude: -118.2437 },
    sports: [
      { id: 'sport1', name: 'Tennis', icon: '🎾' },
      { id: 'sport2', name: 'Basketball', icon: '🏀' },
    ],
    amenities: ['Parking', 'Showers'],
    openingHours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'test-user-id',
    staffIds: [],
  }
];

// Mock facilities
const mockFacilities = [
  {
    id: 'facility1',
    sportsCenterId: 'mock-id',
    name: 'Tennis Court 1',
    sportId: 'sport1',
    capacity: 4,
    pricePerHour: 20,
    isIndoor: false,
  }
];

// Mock auth
export const auth = {
  currentUser: {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
  },
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(auth.currentUser);
    return () => {}; // Return unsubscribe function
  },
  signOut: async () => Promise.resolve(),
  // Add sign in methods
  signInWithEmailAndPassword: async (email: string, password: string) => {
    const user = mockUsers[email];
    if (user && user.password === password) {
      return { user };
    }
    throw new Error('Invalid email or password');
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    if (mockUsers[email]) {
      throw new Error('Email already in use');
    }
    const newUser = {
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
    };
    return { user: newUser };
  }
};

// Mock Google provider
export const googleProvider = {
  setCustomParameters: jest.fn(),
};

// Mock sign in with Google function
export const signInWithGoogle = async () => {
  return auth.currentUser;
};

// Define collection names for consistency
const sportsCentersCollection = 'sportscenters';
const sportsCenterUsersCollection = 'sportscenterusers';
const facilitiesCollection = 'facilities';
const timeSlotsCollection = 'timeslots';
const bookingsCollection = 'bookings';
const promotionsCollection = 'promotions';

// Mock Firestore
export const collection = (dbOrRef: any, collectionName: string) => {
  // Ensure we're working with a valid db reference
  if (!dbOrRef) {
    throw new Error('Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore');
  }
  
  return {
    doc: (id: string) => ({
      get: async () => ({
        exists: () => {
          if (collectionName === sportsCenterUsersCollection) {
            return !!mockSportsCenterUsers[id];
          } else if (collectionName === sportsCentersCollection) {
            return !!mockSportsCenters.find(c => c.id === id);
          }
          return true;
        },
        data: () => {
          if (collectionName === sportsCenterUsersCollection) {
            return mockSportsCenterUsers[id] || null;
          } else if (collectionName === sportsCentersCollection) {
            const center = mockSportsCenters.find(c => c.id === id);
            return center || null;
          }
          return {
            id,
            email: 'test@example.com',
            displayName: 'Test User',
            role: 'admin',
            createdAt: new Date(),
          };
        },
      }),
      set: async (data: any) => {},
      update: async (data: any) => {},
    }),
    add: async (data: any) => ({ id: 'mock-id' }),
    where: (field: string, operator: string, value: any) => ({
      get: async () => ({
        docs: mockSportsCenters
          .filter(center => {
            if (field === 'ownerId' && operator === '==') {
              return center.ownerId === value;
            }
            return true;
          })
          .map(center => ({
            id: center.id,
            data: () => center,
          })),
        forEach: (callback: (doc: any) => void) => {
          mockSportsCenters
            .filter(center => {
              if (field === 'ownerId' && operator === '==') {
                return center.ownerId === value;
              }
              return true;
            })
            .forEach(center => {
              callback({
                id: center.id,
                data: () => center,
              });
            });
        },
      }),
    }),
  };
};

// Mock Firestore db object
export const db = {
  collection: (collectionName: string) => collection(db, collectionName),
  doc: (path: string) => ({
    get: async () => ({
      exists: () => {
        const parts = path.split('/');
        const collectionName = parts[0];
        const id = parts[1];
        
        if (collectionName === sportsCenterUsersCollection) {
          return !!mockSportsCenterUsers[id];
        } else if (collectionName === sportsCentersCollection) {
          return !!mockSportsCenters.find(c => c.id === id);
        }
        return true;
      },
      data: () => {
        const parts = path.split('/');
        const collectionName = parts[0];
        const id = parts[1];
        
        if (collectionName === sportsCenterUsersCollection) {
          return mockSportsCenterUsers[id] || null;
        } else if (collectionName === sportsCentersCollection) {
          const center = mockSportsCenters.find(c => c.id === id);
          return center || null;
        }
        return {
          id,
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'admin',
          createdAt: new Date(),
        };
      },
    }),
    set: async (data: any) => {},
    update: async (data: any) => {},
  }),
};

// Add getDoc function
export const getDoc = async (docRef: any) => {
  return await docRef.get();
};

// Add setDoc function
export const setDoc = async (docRef: any, data: any) => {
  return await docRef.set(data);
};

// Add updateDoc function
export const updateDoc = async (docRef: any, data: any) => {
  return await docRef.update(data);
};

// Add addDoc function
export const addDoc = async (collectionRef: any, data: any) => {
  return await collectionRef.add(data);
};

// Mock Firebase functions
export const getSportsCenterUser = async (userId: string) => {
  // Use the doc function to get a reference to the user document
  const userRef = doc(db, sportsCenterUsersCollection, userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  
  return null;
};

export const createSportsCenterUser = async (userId: string, userData: any) => {
  const newUser = {
    id: userId,
    ...userData,
    createdAt: new Date(),
  };
  mockSportsCenterUsers[userId] = newUser;
  return newUser;
};

export const getSportsCentersByOwner = async (ownerId: string) => {
  // Use the collection and query functions to get sports centers by owner
  const sportsCentersRef = collection(db, sportsCentersCollection);
  // Simulate the query by filtering the mock data
  return mockSportsCenters.filter(center => center.ownerId === ownerId);
};

export const createSportsCenter = async (data: any) => {
  const newCenter = {
    id: `sc-${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockSportsCenters.push(newCenter);
  return newCenter;
};

export const updateSportsCenter = async (id: string, data: any) => {
  const index = mockSportsCenters.findIndex(center => center.id === id);
  if (index !== -1) {
    mockSportsCenters[index] = {
      ...mockSportsCenters[index],
      ...data,
      updatedAt: new Date(),
    };
    return mockSportsCenters[index];
  }
  throw new Error('Sports center not found');
};

export const getSportsCenter = async (id: string) => {
  const center = mockSportsCenters.find(center => center.id === id);
  return center || null;
};

export const createFacility = async (data: any) => {
  const newFacility = {
    id: `facility-${Date.now()}`,
    ...data,
  };
  mockFacilities.push(newFacility);
  return newFacility;
};

export const getFacilitiesBySportsCenter = async (sportsCenterId: string) => {
  return mockFacilities.filter(facility => facility.sportsCenterId === sportsCenterId);
};

export const createTimeSlot = async (data: any) => {
  return { id: `timeslot-${Date.now()}`, ...data };
};

export const getTimeSlotsByFacility = async (facilityId: string) => {
  return [];
};

export const getBookingsBySportsCenter = async (sportsCenterId: string) => {
  return [];
};

export const createPromotion = async (data: any) => {
  return { id: `promo-${Date.now()}`, ...data };
};

export const getPromotionsBySportsCenter = async (sportsCenterId: string) => {
  return [];
};

// Add doc function
export const doc = (dbOrRef: any, collectionPath: string, docId?: string) => {
  // Handle both 2-argument and 3-argument versions
  let collection, id;
  
  if (docId) {
    // 3-argument version: (db, collection, docId)
    collection = collectionPath;
    id = docId;
  } else {
    // 2-argument version: (db, path)
    const parts = collectionPath.split('/');
    collection = parts[0];
    id = parts[1];
  }
  
  return {
    get: async () => ({
      exists: () => {
        if (collection === sportsCenterUsersCollection) {
          return !!mockSportsCenterUsers[id];
        } else if (collection === sportsCentersCollection) {
          return !!mockSportsCenters.find(c => c.id === id);
        }
        return true;
      },
      data: () => {
        if (collection === sportsCenterUsersCollection) {
          return mockSportsCenterUsers[id] || null;
        } else if (collection === sportsCentersCollection) {
          const center = mockSportsCenters.find(c => c.id === id);
          return center || null;
        }
        return {
          id,
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'admin',
          createdAt: new Date(),
        };
      },
    }),
    set: async (data: any) => {},
    update: async (data: any) => {},
  };
}; 