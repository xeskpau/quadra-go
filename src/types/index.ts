// Define types for the application

// Sports Center types
export interface SportsCenterUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'staff';
  createdAt: Date;
}

export interface SportsCenter {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  photoURL?: string;
  coverPhotoURL?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  sports: Sport[];
  amenities: string[];
  openingHours: {
    [key: string]: { open: string; close: string } | { closed: true };
  };
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  staffIds: string[];
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
}

export interface Facility {
  id: string;
  sportsCenterId: string;
  name: string;
  sportId: string;
  description?: string;
  photoURL?: string;
  capacity: number;
  pricePerHour: number;
  isIndoor: boolean;
  amenities?: string[];
}

export interface TimeSlot {
  id: string;
  facilityId: string;
  sportsCenterId: string;
  startTime: Date;
  endTime: Date;
  price: number;
  isAvailable: boolean;
  isSpecialOffer?: boolean;
  specialOfferPrice?: number;
}

export interface Booking {
  id: string;
  userId: string;
  facilityId: string;
  sportsCenterId: string;
  timeSlotId: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  id: string;
  sportsCenterId: string;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  applicableSportIds: string[];
  applicableFacilityIds: string[];
  code: string;
  usageLimit?: number;
  currentUsage: number;
}

export interface AnalyticsData {
  bookings: {
    total: number;
    byDay: { [key: string]: number };
    byFacility: { [key: string]: number };
    bySport: { [key: string]: number };
  };
  revenue: {
    total: number;
    byDay: { [key: string]: number };
    byFacility: { [key: string]: number };
    bySport: { [key: string]: number };
  };
  popularTimeSlots: {
    [key: string]: number;
  };
} 