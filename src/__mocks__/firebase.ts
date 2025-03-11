// Mock Firebase implementation for tests

// Create a mock jest object if it doesn't exist (for browser environment)
if (typeof jest === 'undefined') {
  (window as any).jest = {
    fn: () => {
      type MockFunction = {
        (...args: any[]): any;
        mock: {
          calls: any[][];
          results: { type: string; value: any }[];
          instances: any[];
          contexts: any[];
          lastCall: any[] | undefined;
        };
        implementation?: Function;
        mockImplementation: (implementation: Function) => MockFunction;
        mockReturnValue: (value: any) => MockFunction;
        mockResolvedValue: (value: any) => MockFunction;
      };

      const mockFn = ((...args: any[]) => {
        if (mockFn.implementation) {
          return mockFn.implementation(...args);
        }
        return undefined;
      }) as MockFunction;

      mockFn.mock = {
        calls: [],
        results: [],
        instances: [],
        contexts: [],
        lastCall: undefined
      };

      mockFn.mockImplementation = (implementation: Function) => {
        mockFn.implementation = implementation;
        return mockFn;
      };

      mockFn.mockReturnValue = (value: any) => {
        mockFn.mockImplementation(() => value);
        return mockFn;
      };

      mockFn.mockResolvedValue = (value: any) => {
        mockFn.mockImplementation(() => Promise.resolve(value));
        return mockFn;
      };

      return mockFn;
    }
  };
}

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
    website: 'https://www.lasportscomplex.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,tennis',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,tennis',
    location: { latitude: 34.0522, longitude: -118.2437 },
    sports: [
      { id: 'sport1', name: 'Tennis', icon: '🎾' },
      { id: 'sport2', name: 'Basketball', icon: '🏀' },
      { id: 'sport3', name: 'Soccer', icon: '⚽' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Cafe'],
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
    id: 'sc-sf-1',
    name: 'San Francisco Sports Hub',
    description: 'A premier sports facility in San Francisco',
    address: '456 SF St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94101',
    phone: '123-456-7891',
    email: 'info@sfsportshub.com',
    website: 'https://www.sfsportshub.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,basketball',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,basketball',
    location: { latitude: 37.7749, longitude: -122.4194 },
    sports: [
      { id: 'sport2', name: 'Basketball', icon: '🏀' },
      { id: 'sport7', name: 'Badminton', icon: '🏸' }
    ],
    amenities: ['Parking', 'Showers', 'Pro Shop', 'Wifi'],
    openingHours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '09:00', close: '23:00' },
      sunday: { open: '09:00', close: '20:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-sf-123',
    staffIds: [],
  },
  {
    id: 'sc-sd-1',
    name: 'San Diego Athletic Center',
    description: 'A premier sports facility in San Diego',
    address: '789 SD St',
    city: 'San Diego',
    state: 'CA',
    zipCode: '92101',
    phone: '123-456-7892',
    email: 'info@sdathleticcenter.com',
    website: 'https://www.sdathleticcenter.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,swimming',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,swimming',
    location: { latitude: 32.7157, longitude: -117.1611 },
    sports: [
      { id: 'sport5', name: 'Swimming', icon: '🏊' },
      { id: 'sport10', name: 'Yoga', icon: '🧘' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Childcare'],
    openingHours: {
      monday: { open: '07:00', close: '20:00' },
      tuesday: { open: '07:00', close: '20:00' },
      wednesday: { open: '07:00', close: '20:00' },
      thursday: { open: '07:00', close: '20:00' },
      friday: { open: '07:00', close: '20:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '08:00', close: '16:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-sd-123',
    staffIds: [],
  },
  {
    id: 'sc-sac-1',
    name: 'Sacramento Sports Arena',
    description: 'A premier sports facility in Sacramento',
    address: '101 Sac St',
    city: 'Sacramento',
    state: 'CA',
    zipCode: '95814',
    phone: '123-456-7893',
    email: 'info@sacsportsarena.com',
    website: 'https://www.sacsportsarena.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,soccer',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,soccer',
    location: { latitude: 38.5816, longitude: -121.4944 },
    sports: [
      { id: 'sport3', name: 'Soccer', icon: '⚽' },
      { id: 'sport4', name: 'Volleyball', icon: '🏐' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Pro Shop'],
    openingHours: {
      monday: { open: '08:00', close: '21:00' },
      tuesday: { open: '08:00', close: '21:00' },
      wednesday: { open: '08:00', close: '21:00' },
      thursday: { open: '08:00', close: '21:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '09:00', close: '19:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-sac-123',
    staffIds: [],
  },
  {
    id: 'sc-sj-1',
    name: 'San Jose Sports Pavilion',
    description: 'A premier sports facility in San Jose',
    address: '202 SJ St',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95113',
    phone: '123-456-7894',
    email: 'info@sjsportspavilion.com',
    website: 'https://www.sjsportspavilion.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,volleyball',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,volleyball',
    location: { latitude: 37.3382, longitude: -121.8863 },
    sports: [
      { id: 'sport4', name: 'Volleyball', icon: '🏐' },
      { id: 'sport6', name: 'Beach Volleyball', icon: '🏖️' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Cafe', 'Wifi'],
    openingHours: {
      monday: { open: '07:30', close: '21:30' },
      tuesday: { open: '07:30', close: '21:30' },
      wednesday: { open: '07:30', close: '21:30' },
      thursday: { open: '07:30', close: '21:30' },
      friday: { open: '07:30', close: '22:30' },
      saturday: { open: '08:30', close: '22:30' },
      sunday: { open: '08:30', close: '20:30' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-sj-123',
    staffIds: [],
  },
  {
    id: 'sc-fresno-1',
    name: 'Fresno Sports Club',
    description: 'A premier sports facility in Fresno',
    address: '303 Fresno St',
    city: 'Fresno',
    state: 'CA',
    zipCode: '93721',
    phone: '123-456-7895',
    email: 'info@fresnosportsclub.com',
    website: 'https://www.fresnosportsclub.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,badminton',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,badminton',
    location: { latitude: 36.7378, longitude: -119.7871 },
    sports: [
      { id: 'sport7', name: 'Badminton', icon: '🏸' },
      { id: 'sport8', name: 'Table Tennis', icon: '🏓' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Equipment Rental'],
    openingHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-fresno-123',
    staffIds: [],
  },
  {
    id: 'sc-lb-1',
    name: 'Long Beach Sports Center',
    description: 'A premier sports facility in Long Beach',
    address: '404 LB St',
    city: 'Long Beach',
    state: 'CA',
    zipCode: '90802',
    phone: '123-456-7896',
    email: 'info@lbsportscenter.com',
    website: 'https://www.lbsportscenter.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,tabletennis',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,tabletennis',
    location: { latitude: 33.7701, longitude: -118.1937 },
    sports: [
      { id: 'sport8', name: 'Table Tennis', icon: '🏓' },
      { id: 'sport9', name: 'Golf', icon: '⛳' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Pro Shop', 'Childcare'],
    openingHours: {
      monday: { open: '08:30', close: '20:30' },
      tuesday: { open: '08:30', close: '20:30' },
      wednesday: { open: '08:30', close: '20:30' },
      thursday: { open: '08:30', close: '20:30' },
      friday: { open: '08:30', close: '21:30' },
      saturday: { open: '09:30', close: '21:30' },
      sunday: { open: '09:30', close: '18:30' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-lb-123',
    staffIds: [],
  },
  {
    id: 'sc-oak-1',
    name: 'Oakland Athletic Club',
    description: 'A premier sports facility in Oakland',
    address: '505 Oak St',
    city: 'Oakland',
    state: 'CA',
    zipCode: '94607',
    phone: '123-456-7897',
    email: 'info@oaklandathleticclub.com',
    website: 'https://www.oaklandathleticclub.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,golf',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,golf',
    location: { latitude: 37.8044, longitude: -122.2711 },
    sports: [
      { id: 'sport9', name: 'Golf', icon: '⛳' },
      { id: 'sport1', name: 'Tennis', icon: '🎾' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Pro Shop', 'Cafe'],
    openingHours: {
      monday: { open: '07:00', close: '21:00' },
      tuesday: { open: '07:00', close: '21:00' },
      wednesday: { open: '07:00', close: '21:00' },
      thursday: { open: '07:00', close: '21:00' },
      friday: { open: '07:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '19:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-oak-123',
    staffIds: [],
  },
  {
    id: 'sc-bak-1',
    name: 'Bakersfield Sports Complex',
    description: 'A premier sports facility in Bakersfield',
    address: '606 Bak St',
    city: 'Bakersfield',
    state: 'CA',
    zipCode: '93301',
    phone: '123-456-7898',
    email: 'info@bakersfieldcomplex.com',
    website: 'https://www.bakersfieldcomplex.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,yoga',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,yoga',
    location: { latitude: 35.3733, longitude: -119.0187 },
    sports: [
      { id: 'sport10', name: 'Yoga', icon: '🧘' },
      { id: 'sport3', name: 'Soccer', icon: '⚽' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Wifi', 'Childcare'],
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '09:00', close: '18:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-bak-123',
    staffIds: [],
  },
  {
    id: 'sc-ana-1',
    name: 'Anaheim Sports Center',
    description: 'A premier sports facility in Anaheim',
    address: '707 Ana St',
    city: 'Anaheim',
    state: 'CA',
    zipCode: '92805',
    phone: '123-456-7899',
    email: 'info@anaheimsportscenter.com',
    website: 'https://www.anaheimsportscenter.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports,basketball',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports,basketball',
    location: { latitude: 33.8366, longitude: -117.9143 },
    sports: [
      { id: 'sport2', name: 'Basketball', icon: '🏀' },
      { id: 'sport5', name: 'Swimming', icon: '🏊' }
    ],
    amenities: ['Parking', 'Showers', 'Locker Rooms', 'Cafe', 'Pro Shop'],
    openingHours: {
      monday: { open: '07:30', close: '21:30' },
      tuesday: { open: '07:30', close: '21:30' },
      wednesday: { open: '07:30', close: '21:30' },
      thursday: { open: '07:30', close: '21:30' },
      friday: { open: '07:30', close: '22:30' },
      saturday: { open: '08:30', close: '22:30' },
      sunday: { open: '08:30', close: '19:30' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'sc-ana-123',
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
    website: 'https://www.mocksportscenter.com',
    photoURL: 'https://source.unsplash.com/random/800x600/?sports',
    coverPhotoURL: 'https://source.unsplash.com/random/1600x900/?sports',
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

// Mock sports
const mockSports = [
  { id: 'sport1', name: 'Tennis', icon: '🎾' },
  { id: 'sport2', name: 'Basketball', icon: '🏀' },
  { id: 'sport3', name: 'Soccer', icon: '⚽' },
  { id: 'sport4', name: 'Volleyball', icon: '🏐' },
  { id: 'sport5', name: 'Swimming', icon: '🏊' },
  { id: 'sport6', name: 'Beach Volleyball', icon: '🏖️' },
  { id: 'sport7', name: 'Badminton', icon: '🏸' },
  { id: 'sport8', name: 'Table Tennis', icon: '🏓' },
  { id: 'sport9', name: 'Golf', icon: '⛳' },
  { id: 'sport10', name: 'Yoga', icon: '🧘' }
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
    // Throw a FirebaseError with the code 'auth/invalid-credential'
    const error = new Error('Firebase: Error (auth/invalid-credential)');
    error.name = 'FirebaseError';
    // @ts-ignore
    error.code = 'auth/invalid-credential';
    throw error;
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

// Mock getDocs function
export const getDocs = async (query: any) => {
  console.log('Mock getDocs called');
  const collectionName = query._collectionName;
  
  let data: any[] = [];
  
  if (collectionName === 'sportsCenters') {
    data = mockSportsCenters;
  } else if (collectionName === 'sports') {
    data = mockSports;
  } else if (collectionName === 'users') {
    data = Object.values(mockUsers);
  } else if (collectionName === 'sportsCenterUsers') {
    data = Object.values(mockSportsCenterUsers);
  } else if (collectionName === facilitiesCollection) {
    data = mockFacilities;
  }
  
  return {
    forEach: (callback: (doc: any) => void) => {
      data.forEach((item) => {
        callback({
          id: item.id,
          data: () => item
        });
      });
    },
    docs: data.map(item => ({
      id: item.id,
      data: () => item
    }))
  };
};

// Mock collection function to include _collectionName for getDocs
export const collection = (dbOrRef: any, collectionName: string) => {
  console.log(`Mock collection called with: ${collectionName}`);
  return {
    _collectionName: collectionName,
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
      _collectionName: collectionName,
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

// Add getSportsCenters and getSports functions
export const getSportsCenters = async () => {
  console.log('Mock getSportsCenters called');
  return mockSportsCenters;
};

export const getSports = async () => {
  console.log('Mock getSports called');
  return mockSports;
}; 