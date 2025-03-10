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
  getPromotionsBySportsCenter
} from '../firebase';
import { 
  SportsCenterUser, 
  SportsCenter, 
  Facility, 
  TimeSlot, 
  Booking, 
  Promotion,
  AnalyticsData
} from '../types';

interface SportsCenterContextType {
  sportsCenterUser: SportsCenterUser | null;
  sportsCenters: SportsCenter[];
  currentSportsCenter: SportsCenter | null;
  facilities: Facility[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  promotions: Promotion[];
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

export function SportsCenterProvider({ children }: { children: React.ReactNode }) {
  const [sportsCenterUser, setSportsCenterUser] = useState<SportsCenterUser | null>(null);
  const [sportsCenters, setSportsCenters] = useState<SportsCenter[]>([]);
  const [currentSportsCenter, setCurrentSportsCenter] = useState<SportsCenter | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sports center user data when auth state changes
  useEffect(() => {
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
        setAnalyticsData(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  // Register as a sports center user
  const registerAsSportsCenter = async (displayName: string, role: 'admin' | 'staff'): Promise<SportsCenterUser | null> => {
    if (!auth.currentUser) {
      setError('You must be logged in to register as a sports center');
      return null;
    }
    
    try {
      const userData: Omit<SportsCenterUser, 'id' | 'createdAt'> = {
        email: auth.currentUser.email || '',
        displayName,
        photoURL: auth.currentUser.photoURL || undefined,
        role
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
    if (!auth.currentUser) {
      setError('You must be logged in to create a sports center');
      return null;
    }
    
    try {
      const sportsCenter = await createSportsCenter(data);
      setSportsCenters(prev => [...prev, sportsCenter]);
      
      // Select the newly created sports center
      await selectSportsCenter(sportsCenter.id);
      
      return sportsCenter;
    } catch (err) {
      console.error('Error creating sports center:', err);
      setError('Failed to create sports center');
      return null;
    }
  };

  // Update an existing sports center
  const updateExistingSportsCenter = async (id: string, data: Partial<SportsCenter>): Promise<void> => {
    try {
      await updateSportsCenter(id, data);
      
      // Update local state
      setSportsCenters(prev => 
        prev.map(sc => sc.id === id ? { ...sc, ...data, updatedAt: new Date() } : sc)
      );
      
      // Update current sports center if it's the one being updated
      if (currentSportsCenter && currentSportsCenter.id === id) {
        setCurrentSportsCenter(prev => prev ? { ...prev, ...data, updatedAt: new Date() } : prev);
      }
    } catch (err) {
      console.error('Error updating sports center:', err);
      setError('Failed to update sports center');
    }
  };

  // Select a sports center to work with
  const selectSportsCenter = async (id: string): Promise<void> => {
    try {
      // Get the sports center data
      const sportsCenter = await getSportsCenter(id);
      
      if (sportsCenter) {
        setCurrentSportsCenter(sportsCenter);
        
        // Load related data
        const facilitiesData = await getFacilitiesBySportsCenter(id);
        setFacilities(facilitiesData);
        
        // Load time slots for all facilities
        const allTimeSlots: TimeSlot[] = [];
        for (const facility of facilitiesData) {
          const facilityTimeSlots = await getTimeSlotsByFacility(facility.id);
          allTimeSlots.push(...facilityTimeSlots);
        }
        setTimeSlots(allTimeSlots);
        
        // Load bookings
        await refreshBookings();
        
        // Load promotions
        const promotionsData = await getPromotionsBySportsCenter(id);
        setPromotions(promotionsData);
      } else {
        setError('Sports center not found');
      }
    } catch (err) {
      console.error('Error selecting sports center:', err);
      setError('Failed to load sports center data');
    }
  };

  // Add a new facility
  const addFacility = async (data: Omit<Facility, 'id'>): Promise<Facility | null> => {
    try {
      const facility = await createFacility(data);
      setFacilities(prev => [...prev, facility]);
      return facility;
    } catch (err) {
      console.error('Error adding facility:', err);
      setError('Failed to add facility');
      return null;
    }
  };

  // Add a new time slot
  const addTimeSlot = async (data: Omit<TimeSlot, 'id'>): Promise<TimeSlot | null> => {
    try {
      const timeSlot = await createTimeSlot(data);
      setTimeSlots(prev => [...prev, timeSlot]);
      return timeSlot;
    } catch (err) {
      console.error('Error adding time slot:', err);
      setError('Failed to add time slot');
      return null;
    }
  };

  // Add a new promotion
  const addPromotion = async (data: Omit<Promotion, 'id'>): Promise<Promotion | null> => {
    try {
      const promotion = await createPromotion(data);
      setPromotions(prev => [...prev, promotion]);
      return promotion;
    } catch (err) {
      console.error('Error adding promotion:', err);
      setError('Failed to add promotion');
      return null;
    }
  };

  // Refresh bookings
  const refreshBookings = async (): Promise<void> => {
    if (!currentSportsCenter) return;
    
    try {
      const bookingsData = await getBookingsBySportsCenter(currentSportsCenter.id);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error refreshing bookings:', err);
      setError('Failed to refresh bookings');
    }
  };

  // Generate analytics data
  const generateAnalytics = async (): Promise<AnalyticsData | null> => {
    if (!currentSportsCenter || !bookings.length) {
      return null;
    }
    
    try {
      // Calculate analytics from bookings data
      const bookingsByDay: { [key: string]: number } = {};
      const bookingsByFacility: { [key: string]: number } = {};
      const bookingsBySport: { [key: string]: number } = {};
      const revenueByDay: { [key: string]: number } = {};
      const revenueByFacility: { [key: string]: number } = {};
      const revenueBySport: { [key: string]: number } = {};
      const popularTimeSlots: { [key: string]: number } = {};
      
      let totalBookings = 0;
      let totalRevenue = 0;
      
      bookings.forEach(booking => {
        // Only count confirmed and completed bookings
        if (booking.status === 'confirmed' || booking.status === 'completed') {
          totalBookings++;
          totalRevenue += booking.totalPrice;
          
          // By day
          const day = booking.startTime.toISOString().split('T')[0];
          bookingsByDay[day] = (bookingsByDay[day] || 0) + 1;
          revenueByDay[day] = (revenueByDay[day] || 0) + booking.totalPrice;
          
          // By facility
          bookingsByFacility[booking.facilityId] = (bookingsByFacility[booking.facilityId] || 0) + 1;
          revenueByFacility[booking.facilityId] = (revenueByFacility[booking.facilityId] || 0) + booking.totalPrice;
          
          // By time slot
          const hour = booking.startTime.getHours();
          const timeSlotKey = `${hour}:00-${hour + 1}:00`;
          popularTimeSlots[timeSlotKey] = (popularTimeSlots[timeSlotKey] || 0) + 1;
          
          // By sport (need to look up the facility to get the sport)
          const facility = facilities.find(f => f.id === booking.facilityId);
          if (facility) {
            bookingsBySport[facility.sportId] = (bookingsBySport[facility.sportId] || 0) + 1;
            revenueBySport[facility.sportId] = (revenueBySport[facility.sportId] || 0) + booking.totalPrice;
          }
        }
      });
      
      const analytics: AnalyticsData = {
        bookings: {
          total: totalBookings,
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

  const value = {
    sportsCenterUser,
    sportsCenters,
    currentSportsCenter,
    facilities,
    timeSlots,
    bookings,
    promotions,
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
    generateAnalytics
  };

  return (
    <SportsCenterContext.Provider value={value}>
      {children}
    </SportsCenterContext.Provider>
  );
} 