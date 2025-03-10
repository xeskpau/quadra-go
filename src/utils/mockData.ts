import { SportsCenter, Sport, Facility, TimeSlot, Booking, Promotion } from '../types';

// Mock sports data
export const mockSports: Sport[] = [
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

// Mock amenities
export const mockAmenities = [
  'Parking',
  'Showers',
  'Locker Rooms',
  'Equipment Rental',
  'Cafe',
  'Pro Shop',
  'Wifi',
  'Restrooms',
  'Water Fountains',
  'Spectator Seating',
  'Air Conditioning',
  'Lighting for Night Play',
  'Coaching Available',
  'Childcare',
  'Fitness Center'
];

// California cities with coordinates
export const californiaLocations = [
  { city: 'Los Angeles', state: 'CA', latitude: 34.0522, longitude: -118.2437 },
  { city: 'San Francisco', state: 'CA', latitude: 37.7749, longitude: -122.4194 },
  { city: 'San Diego', state: 'CA', latitude: 32.7157, longitude: -117.1611 },
  { city: 'Sacramento', state: 'CA', latitude: 38.5816, longitude: -121.4944 },
  { city: 'San Jose', state: 'CA', latitude: 37.3382, longitude: -121.8863 },
  { city: 'Fresno', state: 'CA', latitude: 36.7378, longitude: -119.7871 },
  { city: 'Long Beach', state: 'CA', latitude: 33.7701, longitude: -118.1937 },
  { city: 'Oakland', state: 'CA', latitude: 37.8044, longitude: -122.2711 },
  { city: 'Bakersfield', state: 'CA', latitude: 35.3733, longitude: -119.0187 },
  { city: 'Anaheim', state: 'CA', latitude: 33.8366, longitude: -117.9143 }
];

// Helper function to generate random opening hours
const generateOpeningHours = () => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const openingHours: { [key: string]: { open: string; close: string } | { closed: true } } = {};
  
  days.forEach(day => {
    // 20% chance of being closed on a given day
    if (Math.random() < 0.2 && day !== 'saturday' && day !== 'sunday') {
      openingHours[day] = { closed: true };
    } else {
      // Random opening time between 6am and 10am
      const openHour = Math.floor(Math.random() * 4) + 6;
      // Random closing time between 6pm and 11pm
      const closeHour = Math.floor(Math.random() * 5) + 18;
      
      openingHours[day] = {
        open: `${openHour.toString().padStart(2, '0')}:00`,
        close: `${closeHour.toString().padStart(2, '0')}:00`
      };
    }
  });
  
  return openingHours;
};

// Helper function to generate random sports for a center
const generateSports = () => {
  const numSports = Math.floor(Math.random() * 5) + 2; // 2-6 sports
  const shuffled = [...mockSports].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numSports);
};

// Helper function to generate random amenities
const generateAmenities = () => {
  const numAmenities = Math.floor(Math.random() * 8) + 3; // 3-10 amenities
  const shuffled = [...mockAmenities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numAmenities);
};

// Helper function to generate a random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate 10 mock sports centers
export const generateMockSportsCenters = (ownerId: string): SportsCenter[] => {
  return californiaLocations.map((location, index) => {
    const id = `sc${index + 1}`;
    const sports = generateSports();
    const now = new Date();
    
    return {
      id,
      name: `${location.city} Sports Complex`,
      description: `A premier sports facility in ${location.city}, offering a variety of activities including ${sports.map(s => s.name).join(', ')}.`,
      address: `${1000 + Math.floor(Math.random() * 9000)} Main Street`,
      city: location.city,
      state: location.state,
      zipCode: `9${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `info@${location.city.toLowerCase().replace(/\s+/g, '')}sports.com`,
      website: `https://www.${location.city.toLowerCase().replace(/\s+/g, '')}sports.com`,
      photoURL: `https://source.unsplash.com/random/800x600/?sports,${sports[0].name.toLowerCase()}`,
      coverPhotoURL: `https://source.unsplash.com/random/1600x900/?sports,${sports[0].name.toLowerCase()}`,
      location: {
        latitude: location.latitude + (Math.random() * 0.1 - 0.05),
        longitude: location.longitude + (Math.random() * 0.1 - 0.05)
      },
      sports,
      amenities: generateAmenities(),
      openingHours: generateOpeningHours(),
      createdAt: randomDate(new Date(now.getFullYear() - 2, 0, 1), now),
      updatedAt: now,
      ownerId,
      staffIds: []
    };
  });
};

// Generate facilities for a sports center
export const generateMockFacilities = (sportsCenter: SportsCenter): Facility[] => {
  const facilities: Facility[] = [];
  
  sportsCenter.sports.forEach((sport, index) => {
    // Generate 1-3 facilities per sport
    const numFacilities = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numFacilities; i++) {
      const facilityId = `${sportsCenter.id}_facility_${sport.id}_${i + 1}`;
      const isIndoor = Math.random() > 0.5;
      
      facilities.push({
        id: facilityId,
        sportsCenterId: sportsCenter.id,
        name: `${sport.name} ${isIndoor ? 'Indoor' : 'Outdoor'} ${i + 1}`,
        sportId: sport.id,
        description: `${isIndoor ? 'Indoor' : 'Outdoor'} ${sport.name} facility with professional-grade equipment.`,
        photoURL: `https://source.unsplash.com/random/800x600/?${sport.name.toLowerCase()},${isIndoor ? 'indoor' : 'outdoor'}`,
        capacity: Math.floor(Math.random() * 20) + 5, // 5-24 people
        pricePerHour: Math.floor(Math.random() * 50) + 20, // $20-$69 per hour
        isIndoor,
        amenities: sportsCenter.amenities.filter(() => Math.random() > 0.5) // Random subset of center amenities
      });
    }
  });
  
  return facilities;
};

// Generate time slots for a facility
export const generateMockTimeSlots = (facility: Facility, sportsCenter: SportsCenter): TimeSlot[] => {
  const timeSlots: TimeSlot[] = [];
  const now = new Date();
  
  // Generate time slots for the next 14 days
  for (let day = 0; day < 14; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Check if the center is open on this day
    const hours = sportsCenter.openingHours[dayOfWeek];
    if (hours && !('closed' in hours)) {
      // Parse opening and closing hours
      const openHour = parseInt(hours.open.split(':')[0]);
      const closeHour = parseInt(hours.close.split(':')[0]);
      
      // Generate hourly slots
      for (let hour = openHour; hour < closeHour; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);
        
        // Skip slots in the past
        if (startTime <= now) continue;
        
        // 80% chance of being available
        const isAvailable = Math.random() < 0.8;
        
        // 20% chance of having a special offer
        const hasSpecialOffer = Math.random() < 0.2;
        const specialOfferPrice = hasSpecialOffer ? Math.floor(facility.pricePerHour * 0.7) : undefined;
        
        timeSlots.push({
          id: `${facility.id}_slot_${startTime.toISOString()}`,
          facilityId: facility.id,
          sportsCenterId: sportsCenter.id,
          startTime,
          endTime,
          price: facility.pricePerHour,
          isAvailable,
          isSpecialOffer: hasSpecialOffer,
          specialOfferPrice
        });
      }
    }
  }
  
  return timeSlots;
};

// Generate bookings for a sports center
export const generateMockBookings = (
  sportsCenterId: string, 
  facilities: Facility[], 
  timeSlots: TimeSlot[]
): Booking[] => {
  const bookings: Booking[] = [];
  const now = new Date();
  
  // Generate 20-50 bookings
  const numBookings = Math.floor(Math.random() * 31) + 20;
  
  for (let i = 0; i < numBookings; i++) {
    // Pick a random facility
    const facility = facilities[Math.floor(Math.random() * facilities.length)];
    
    // Find available time slots for this facility
    const availableSlots = timeSlots.filter(
      slot => slot.facilityId === facility.id && slot.isAvailable
    );
    
    if (availableSlots.length > 0) {
      // Pick a random time slot
      const timeSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      
      // Generate a random user ID (in a real app, this would be a real user)
      const userId = `user_${Math.floor(Math.random() * 1000) + 1}`;
      
      // Random booking status
      const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)] as 'pending' | 'confirmed' | 'cancelled' | 'completed';
      
      // Calculate price (use special offer price if available)
      const price = timeSlot.isSpecialOffer && timeSlot.specialOfferPrice 
        ? timeSlot.specialOfferPrice 
        : timeSlot.price;
      
      bookings.push({
        id: `booking_${i + 1}_${sportsCenterId}`,
        userId,
        facilityId: facility.id,
        sportsCenterId,
        timeSlotId: timeSlot.id,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        status,
        totalPrice: price,
        createdAt: randomDate(new Date(now.getFullYear(), now.getMonth() - 1, 1), now),
        updatedAt: now
      });
      
      // Mark the time slot as unavailable if booking is confirmed or completed
      if (status === 'confirmed' || status === 'completed') {
        timeSlot.isAvailable = false;
      }
    }
  }
  
  return bookings;
};

// Generate promotions for a sports center
export const generateMockPromotions = (sportsCenterId: string, sports: Sport[]): Promotion[] => {
  const promotions: Promotion[] = [];
  const now = new Date();
  
  // Generate 2-5 promotions
  const numPromotions = Math.floor(Math.random() * 4) + 2;
  
  for (let i = 0; i < numPromotions; i++) {
    const startDate = randomDate(now, new Date(now.getFullYear(), now.getMonth() + 3, 0));
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + Math.floor(Math.random() * 3) + 1);
    
    // Random discount percentage
    const discountPercentage = (Math.floor(Math.random() * 4) + 1) * 5; // 5%, 10%, 15%, or 20%
    
    // Random applicable sports (1-3)
    const numSports = Math.floor(Math.random() * 3) + 1;
    const applicableSports = [...sports].sort(() => 0.5 - Math.random()).slice(0, numSports);
    
    promotions.push({
      id: `promo_${i + 1}_${sportsCenterId}`,
      sportsCenterId,
      name: `${discountPercentage}% Off ${applicableSports.map(s => s.name).join(' & ')}`,
      description: `Get ${discountPercentage}% off all ${applicableSports.map(s => s.name).join(' and ')} bookings. Valid from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`,
      discountPercentage,
      startDate,
      endDate,
      applicableSportIds: applicableSports.map(s => s.id),
      applicableFacilityIds: [], // This would be populated in a real app
      code: `${applicableSports[0].name.toUpperCase().substring(0, 3)}${discountPercentage}`,
      usageLimit: Math.floor(Math.random() * 50) + 10,
      currentUsage: 0
    });
  }
  
  return promotions;
}; 