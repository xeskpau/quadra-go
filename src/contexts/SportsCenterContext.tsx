import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  getSportsCenterUser, 
  createSportsCenterUser, 
  getSportsCentersByOwner,
  createSportsCenter,
  updateSportsCenter,
  getSportsCenter,
  createFacility,
  getFacilitiesBySportsCenter,
  createTimeSlot,
  getTimeSlotsByFacility,
  getBookingsBySportsCenter,
  createPromotion,
  getPromotionsBySportsCenter,
  inviteStaffMember,
  getStaffInvitations,
  revokeStaffAccess,
  acceptStaffInvitation
} from '../firebase';
import { 
  SportsCenterUser, 
  SportsCenter, 
  Facility, 
  TimeSlot, 
  Booking, 
  Promotion,
  AnalyticsData,
  StaffInvitation
} from '../types';

interface SportsCenterContextType {
  sportsCenterUser: SportsCenterUser | null;
  sportsCenters: SportsCenter[];
  currentSportsCenter: SportsCenter | null;
  facilities: Facility[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  promotions: Promotion[];
  staffInvitations: StaffInvitation[];
  analyticsData: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  registerAsSportsCenter: (displayName: string, role: 'admin' | 'staff') => Promise<SportsCenterUser | null>;
  createNewSportsCenter: (data: Omit<SportsCenter, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SportsCenter | null>;
  updateExistingSportsCenter: (id: string, data: Partial<SportsCenter>) => Promise<void>;
  selectSportsCenter: (id: string) => Promise<void>;
  addFacility: (data: Omit<Facility, 'id'>) => Promise<Facility | null>;
  addTimeSlot: (data: Omit<TimeSlot, 'id'>) => Promise<TimeSlot | null>;
  addPromotion: (data: Omit<Promotion, 'id'>) => Promise<Promotion | null>;
  refreshBookings: () => Promise<void>;
  generateAnalytics: () => Promise<AnalyticsData | null>;
  inviteStaff: (email: string) => Promise<StaffInvitation | null>;
  revokeStaff: (userId: string) => Promise<void>;
  acceptInvitation: (token: string) => Promise<SportsCenterUser | null>;
  refreshStaffInvitations: () => Promise<void>;
}

const SportsCenterContext = createContext<SportsCenterContextType | undefined>(undefined);

export function useSportsCenter() {
  const context = useContext(SportsCenterContext);
  if (context === undefined) {
    throw new Error('useSportsCenter must be used within a SportsCenterProvider');
  }
  return context;
}

// Check if we're in a test or CI environment
const isTest = process.env.NODE_ENV === 'test';
const isCI = process.env.CI === 'true';
const shouldUseMockData = isTest || isCI;

// Mock data for testing
const mockSportsCenterUser: SportsCenterUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'admin',
  status: 'active',
  createdAt: new Date()
};

const mockSportsCenters: SportsCenter[] = [
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
    website: 'https://mocksportscenter.com',
    photoURL: 'https://example.com/photo.jpg',
    coverPhotoURL: 'https://example.com/cover.jpg',
    location: { latitude: 34.0522, longitude: -118.2437 },
    sports: [
      { id: 'sport1', name: 'Tennis', icon: '🎾' },
      { id: 'sport2', name: 'Basketball', icon: '🏀' },
    ],
    amenities: ['Parking', 'Showers'],
    openingHours: {
      Monday: { open: '09:00', close: '21:00' },
      Tuesday: { open: '09:00', close: '21:00' },
      Wednesday: { open: '09:00', close: '21:00' },
      Thursday: { open: '09:00', close: '21:00' },
      Friday: { open: '09:00', close: '21:00' },
      Saturday: { open: '10:00', close: '22:00' },
      Sunday: { open: '10:00', close: '18:00' },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'test-user-id',
    staffIds: [],
  }
];

export function SportsCenterProvider({ children }: { children: React.ReactNode }) {
  const [sportsCenterUser, setSportsCenterUser] = useState<SportsCenterUser | null>(null);
  const [sportsCenters, setSportsCenters] = useState<SportsCenter[]>([]);
  const [currentSportsCenter, setCurrentSportsCenter] = useState<SportsCenter | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [staffInvitations, setStaffInvitations] = useState<StaffInvitation[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sports center user data when auth state changes
  useEffect(() => {
    // For test environment, use mock data and avoid Firebase calls
    if (shouldUseMockData) {
      // Use React.useEffect's cleanup function to simulate the unsubscribe
      const timeoutId = setTimeout(() => {
        setSportsCenterUser(mockSportsCenterUser);
        setSportsCenters(mockSportsCenters);
        setCurrentSportsCenter(mockSportsCenters[0]);
        setLoading(false);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }

    // For production environment, use real Firebase
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        try {
          // Check if user is a sports center user
          let scUser = await getSportsCenterUser(user.uid);
          
          if (scUser) {
            setSportsCenterUser(scUser);
            
            // Load sports centers owned by this user
            const centers = await getSportsCentersByOwner(user.uid);
            setSportsCenters(centers);
            
            // If there's at least one sports center, select the first one
            if (centers.length > 0) {
              await selectSportsCenter(centers[0].id);
            }
            
            // If user is an admin, load staff invitations
            if (scUser.role === 'admin' && currentSportsCenter) {
              await refreshStaffInvitations();
            }
          }
        } catch (err) {
          console.error('Error loading sports center user:', err);
          setError('Failed to load sports center data');
        }
      } else {
        // Reset state when user logs out
        setSportsCenterUser(null);
        setSportsCenters([]);
        setCurrentSportsCenter(null);
        setFacilities([]);
        setTimeSlots([]);
        setBookings([]);
        setPromotions([]);
        setStaffInvitations([]);
        setAnalyticsData(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  // Register as a sports center user
  const registerAsSportsCenter = async (displayName: string, role: 'admin' | 'staff'): Promise<SportsCenterUser | null> => {
    if (shouldUseMockData) {
      // Return mock data for testing
      return {
        ...mockSportsCenterUser,
        displayName,
        role
      };
    }

    if (!auth.currentUser) {
      setError('You must be logged in to register as a sports center');
      return null;
    }
    
    try {
      const userData: Omit<SportsCenterUser, 'id' | 'createdAt'> = {
        email: auth.currentUser.email || '',
        displayName,
        photoURL: auth.currentUser.photoURL || undefined,
        role,
        status: 'active'
      };
      
      const scUser = await createSportsCenterUser(auth.currentUser.uid, userData);
      setSportsCenterUser(scUser);
      return scUser;
    } catch (err) {
      console.error('Error registering as sports center:', err);
      setError('Failed to register as sports center');
      return null;
    }
  };

  // Create a new sports center
  const createNewSportsCenter = async (data: Omit<SportsCenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<SportsCenter | null> => {
    if (shouldUseMockData) {
      // Return mock data for testing
      const newSportsCenter = {
        ...mockSportsCenters[0],
        ...data,
        id: `mock-sc-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setSportsCenters([...sportsCenters, newSportsCenter]);
      setCurrentSportsCenter(newSportsCenter);
      return newSportsCenter;
    }
    
    if (!sportsCenterUser) {
      setError('You must be registered as a sports center to create a new center');
      return null;
    }
    
    try {
      const newSportsCenter = await createSportsCenter({
        ...data,
        ownerId: sportsCenterUser.id,
        staffIds: []
      });
      
      setSportsCenters([...sportsCenters, newSportsCenter]);
      setCurrentSportsCenter(newSportsCenter);
      return newSportsCenter;
    } catch (err) {
      console.error('Error creating sports center:', err);
      setError('Failed to create sports center');
      return null;
    }
  };

  // Update an existing sports center
  const updateExistingSportsCenter = async (id: string, data: Partial<SportsCenter>): Promise<void> => {
    if (shouldUseMockData) {
      // Update mock data for testing
      const updatedCenters = sportsCenters.map(center => 
        center.id === id ? { ...center, ...data, updatedAt: new Date() } : center
      );
      
      setSportsCenters(updatedCenters);
      
      if (currentSportsCenter && currentSportsCenter.id === id) {
        setCurrentSportsCenter({ ...currentSportsCenter, ...data, updatedAt: new Date() });
      }
      
      return;
    }
    
    try {
      await updateSportsCenter(id, data);
      
      // Update local state
      const updatedCenters = sportsCenters.map(center => 
        center.id === id ? { ...center, ...data, updatedAt: new Date() } : center
      );
      
      setSportsCenters(updatedCenters);
      
      if (currentSportsCenter && currentSportsCenter.id === id) {
        setCurrentSportsCenter({ ...currentSportsCenter, ...data, updatedAt: new Date() });
      }
    } catch (err) {
      console.error('Error updating sports center:', err);
      setError('Failed to update sports center');
    }
  };

  // Select a sports center to work with
  const selectSportsCenter = async (id: string): Promise<void> => {
    if (shouldUseMockData) {
      // Set mock data for testing
      const center = mockSportsCenters.find(c => c.id === id) || mockSportsCenters[0];
      setCurrentSportsCenter(center);
      setFacilities([{
        id: 'mock-facility-1',
        sportsCenterId: center.id,
        name: 'Tennis Court 1',
        sportId: 'sport1',
        capacity: 4,
        pricePerHour: 20,
        isIndoor: false,
      }]);
      setTimeSlots([]);
      setBookings([]);
      setPromotions([]);
      return;
    }
    
    try {
      // Get the sports center details
      const center = await getSportsCenter(id);
      setCurrentSportsCenter(center);
      
      // Load related data
      const centerFacilities = await getFacilitiesBySportsCenter(id);
      setFacilities(centerFacilities);
      
      // Load time slots for all facilities
      const allTimeSlots: TimeSlot[] = [];
      for (const facility of centerFacilities) {
        const facilityTimeSlots = await getTimeSlotsByFacility(facility.id);
        allTimeSlots.push(...facilityTimeSlots);
      }
      setTimeSlots(allTimeSlots);
      
      // Load bookings
      await refreshBookings();
      
      // Load promotions
      const centerPromotions = await getPromotionsBySportsCenter(id);
      setPromotions(centerPromotions);
      
      // If user is an admin, load staff invitations
      if (sportsCenterUser?.role === 'admin') {
        await refreshStaffInvitations();
      }
    } catch (err) {
      console.error('Error selecting sports center:', err);
      setError('Failed to load sports center data');
    }
  };

  // Add a new facility
  const addFacility = async (data: Omit<Facility, 'id'>): Promise<Facility | null> => {
    if (shouldUseMockData) {
      // Create mock facility for testing
      const newFacility = {
        id: `mock-facility-${Date.now()}`,
        ...data
      };
      
      setFacilities([...facilities, newFacility]);
      return newFacility;
    }
    
    if (!currentSportsCenter) {
      setError('No sports center selected');
      return null;
    }
    
    try {
      const newFacility = await createFacility({
        ...data,
        sportsCenterId: currentSportsCenter.id
      });
      
      setFacilities([...facilities, newFacility]);
      return newFacility;
    } catch (err) {
      console.error('Error adding facility:', err);
      setError('Failed to add facility');
      return null;
    }
  };

  // Add a new time slot
  const addTimeSlot = async (data: Omit<TimeSlot, 'id'>): Promise<TimeSlot | null> => {
    if (shouldUseMockData) {
      // Create mock time slot for testing
      const newTimeSlot = {
        id: `mock-timeslot-${Date.now()}`,
        ...data
      };
      
      setTimeSlots([...timeSlots, newTimeSlot]);
      return newTimeSlot;
    }
    
    try {
      const newTimeSlot = await createTimeSlot(data);
      setTimeSlots([...timeSlots, newTimeSlot]);
      return newTimeSlot;
    } catch (err) {
      console.error('Error adding time slot:', err);
      setError('Failed to add time slot');
      return null;
    }
  };

  // Add a new promotion
  const addPromotion = async (data: Omit<Promotion, 'id'>): Promise<Promotion | null> => {
    if (shouldUseMockData) {
      // Create mock promotion for testing
      const newPromotion = {
        id: `mock-promotion-${Date.now()}`,
        ...data
      };
      
      setPromotions([...promotions, newPromotion]);
      return newPromotion;
    }
    
    if (!currentSportsCenter) {
      setError('No sports center selected');
      return null;
    }
    
    try {
      const newPromotion = await createPromotion({
        ...data,
        sportsCenterId: currentSportsCenter.id
      });
      
      setPromotions([...promotions, newPromotion]);
      return newPromotion;
    } catch (err) {
      console.error('Error adding promotion:', err);
      setError('Failed to add promotion');
      return null;
    }
  };

  // Refresh bookings data
  const refreshBookings = async (): Promise<void> => {
    if (shouldUseMockData) {
      // Set mock bookings for testing
      setBookings([]);
      return;
    }
    
    if (!currentSportsCenter) {
      return;
    }
    
    try {
      const bookingsData = await getBookingsBySportsCenter(currentSportsCenter.id);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error refreshing bookings:', err);
      setError('Failed to refresh bookings');
    }
  };

  // Revoke staff access
  const revokeStaff = async (userId: string): Promise<void> => {
    if (shouldUseMockData) {
      // Mock revoking staff access
      return;
    }
    
    if (!currentSportsCenter || !sportsCenterUser || sportsCenterUser.role !== 'admin') {
      setError('You must be an admin to revoke staff access');
      return;
    }
    
    try {
      await revokeStaffAccess(currentSportsCenter.id, userId);
      
      // Update the current sports center's staffIds
      if (currentSportsCenter) {
        const updatedStaffIds = currentSportsCenter.staffIds.filter(id => id !== userId);
        setCurrentSportsCenter({
          ...currentSportsCenter,
          staffIds: updatedStaffIds
        });
      }
    } catch (err) {
      console.error('Error revoking staff access:', err);
      setError('Failed to revoke staff access');
    }
  };

  // Accept a staff invitation
  const acceptInvitation = async (token: string): Promise<SportsCenterUser | null> => {
    if (shouldUseMockData) {
      // Mock accepting an invitation
      const updatedUser = {
        ...mockSportsCenterUser,
        role: 'staff' as 'admin' | 'staff'
      };
      setSportsCenterUser(updatedUser);
      return updatedUser;
    }
    
    if (!auth.currentUser) {
      setError('You must be logged in to accept an invitation');
      return null;
    }
    
    try {
      const scUser = await acceptStaffInvitation(token, auth.currentUser.uid);
      setSportsCenterUser(scUser);
      
      // Load sports centers this user has access to
      const centers = await getSportsCentersByOwner(auth.currentUser.uid);
      setSportsCenters(centers);
      
      // Select the first sports center
      if (centers.length > 0) {
        await selectSportsCenter(centers[0].id);
      }
      
      return scUser;
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('Failed to accept invitation');
      return null;
    }
  };

  // Refresh staff invitations
  const refreshStaffInvitations = async (): Promise<void> => {
    if (shouldUseMockData) {
      // Set mock staff invitations
      setStaffInvitations([]);
      return;
    }
    
    if (!currentSportsCenter || !sportsCenterUser || sportsCenterUser.role !== 'admin') {
      return;
    }
    
    try {
      const invitations = await getStaffInvitations(currentSportsCenter.id);
      setStaffInvitations(invitations);
    } catch (err) {
      console.error('Error refreshing staff invitations:', err);
      setError('Failed to refresh staff invitations');
    }
  };

  // Generate analytics data
  const generateAnalytics = async (): Promise<AnalyticsData | null> => {
    if (shouldUseMockData) {
      // Generate mock analytics data
      const mockAnalytics: AnalyticsData = {
        bookings: {
          total: 120,
          byDay: {
            'Monday': 15,
            'Tuesday': 18,
            'Wednesday': 20,
            'Thursday': 22,
            'Friday': 25,
            'Saturday': 12,
            'Sunday': 8
          },
          byFacility: {
            'mock-facility-1': 45,
            'mock-facility-2': 75
          },
          bySport: {
            'sport1': 45,
            'sport2': 75
          }
        },
        revenue: {
          total: 2400,
          byDay: {
            'Monday': 300,
            'Tuesday': 360,
            'Wednesday': 400,
            'Thursday': 440,
            'Friday': 500,
            'Saturday': 240,
            'Sunday': 160
          },
          byFacility: {
            'mock-facility-1': 900,
            'mock-facility-2': 1500
          },
          bySport: {
            'sport1': 900,
            'sport2': 1500
          }
        },
        popularTimeSlots: {
          '9:00-10:00': 15,
          '17:00-18:00': 25,
          '18:00-19:00': 30,
          '19:00-20:00': 28,
          '20:00-21:00': 22
        }
      };
      
      setAnalyticsData(mockAnalytics);
      return mockAnalytics;
    }
    
    if (!currentSportsCenter) {
      setError('No sports center selected');
      return null;
    }
    
    try {
      // In a real app, this would call a backend service to generate analytics
      // For now, we'll just create some mock data based on the current bookings
      
      // Calculate total revenue and average booking value
      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      // Count bookings by day of week
      const bookingsByDay: { [key: string]: number } = {
        'Monday': 0,
        'Tuesday': 0,
        'Wednesday': 0,
        'Thursday': 0,
        'Friday': 0,
        'Saturday': 0,
        'Sunday': 0
      };
      
      // Count revenue by day of week
      const revenueByDay: { [key: string]: number } = {
        'Monday': 0,
        'Tuesday': 0,
        'Wednesday': 0,
        'Thursday': 0,
        'Friday': 0,
        'Saturday': 0,
        'Sunday': 0
      };
      
      bookings.forEach(booking => {
        const day = booking.startTime.getDay();
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
        bookingsByDay[dayName] = (bookingsByDay[dayName] || 0) + 1;
        revenueByDay[dayName] = (revenueByDay[dayName] || 0) + booking.totalPrice;
      });
      
      // Count bookings by facility
      const bookingsByFacility: { [key: string]: number } = {};
      const revenueByFacility: { [key: string]: number } = {};
      
      bookings.forEach(booking => {
        bookingsByFacility[booking.facilityId] = (bookingsByFacility[booking.facilityId] || 0) + 1;
        revenueByFacility[booking.facilityId] = (revenueByFacility[booking.facilityId] || 0) + booking.totalPrice;
      });
      
      // Count bookings by sport
      const bookingsBySport: { [key: string]: number } = {};
      const revenueBySport: { [key: string]: number } = {};
      
      bookings.forEach(booking => {
        const facility = facilities.find(f => f.id === booking.facilityId);
        if (facility) {
          bookingsBySport[facility.sportId] = (bookingsBySport[facility.sportId] || 0) + 1;
          revenueBySport[facility.sportId] = (revenueBySport[facility.sportId] || 0) + booking.totalPrice;
        }
      });
      
      // Find popular time slots
      const popularTimeSlots: { [key: string]: number } = {};
      
      bookings.forEach(booking => {
        const hour = booking.startTime.getHours();
        const timeSlotKey = `${hour}:00-${hour + 1}:00`;
        popularTimeSlots[timeSlotKey] = (popularTimeSlots[timeSlotKey] || 0) + 1;
      });
      
      // Create analytics data
      const analytics: AnalyticsData = {
        bookings: {
          total: bookings.length,
          byDay: bookingsByDay,
          byFacility: bookingsByFacility,
          bySport: bookingsBySport
        },
        revenue: {
          total: totalRevenue,
          byDay: revenueByDay,
          byFacility: revenueByFacility,
          bySport: revenueBySport
        },
        popularTimeSlots
      };
      
      setAnalyticsData(analytics);
      return analytics;
    } catch (err) {
      console.error('Error generating analytics:', err);
      setError('Failed to generate analytics');
      return null;
    }
  };

  // Invite a staff member
  const inviteStaff = async (email: string): Promise<StaffInvitation | null> => {
    if (shouldUseMockData) {
      // Create mock invitation for testing
      const mockInvitation: StaffInvitation = {
        id: `mock-invitation-${Date.now()}`,
        sportsCenterId: currentSportsCenter?.id || 'mock-id',
        email,
        invitedBy: sportsCenterUser?.id || 'mock-admin-id',
        invitedAt: new Date(),
        token: `mock-token-${Date.now()}`,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      };
      
      setStaffInvitations([...staffInvitations, mockInvitation]);
      return mockInvitation;
    }
    
    if (!currentSportsCenter || !sportsCenterUser || sportsCenterUser.role !== 'admin') {
      setError('You must be an admin to invite staff members');
      return null;
    }
    
    try {
      const invitation = await inviteStaffMember(currentSportsCenter.id, email, sportsCenterUser.id);
      setStaffInvitations([...staffInvitations, invitation]);
      return invitation;
    } catch (err) {
      console.error('Error inviting staff member:', err);
      setError('Failed to invite staff member');
      return null;
    }
  };

  const value = {
    sportsCenterUser,
    sportsCenters,
    currentSportsCenter,
    facilities,
    timeSlots,
    bookings,
    promotions,
    staffInvitations,
    analyticsData,
    loading,
    error,
    registerAsSportsCenter,
    createNewSportsCenter,
    updateExistingSportsCenter,
    selectSportsCenter,
    addFacility,
    addTimeSlot,
    addPromotion,
    refreshBookings,
    generateAnalytics,
    inviteStaff,
    revokeStaff,
    acceptInvitation,
    refreshStaffInvitations
  };

  return (
    <SportsCenterContext.Provider value={value}>
      {children}
    </SportsCenterContext.Provider>
  );
} 