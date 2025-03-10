export interface SportsCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  description: string;
  rating: number;
  image: string;
  sports: string[];
  location: {
    lat: number;
    lng: number;
  };
  availableTimes: {
    date: string;
    slots: {
      time: string;
      available: boolean;
      price: number;
    }[];
  }[];
}

export const mockSportsCenters: SportsCenter[] = [
  {
    id: '1',
    name: 'Beach Sports Arena',
    address: '123 Beach Blvd',
    city: 'Miami',
    description: 'Premier beach sports facility with multiple courts for beach volleyball and beach tennis.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    sports: ['beach volley', 'beach tennis'],
    location: {
      lat: 25.761681,
      lng: -80.191788
    },
    availableTimes: [
      {
        date: '2023-06-15',
        slots: [
          { time: '09:00', available: true, price: 25 },
          { time: '10:00', available: true, price: 25 },
          { time: '11:00', available: false, price: 25 },
          { time: '12:00', available: true, price: 30 },
          { time: '13:00', available: true, price: 30 },
          { time: '14:00', available: false, price: 30 },
          { time: '15:00', available: true, price: 35 },
          { time: '16:00', available: true, price: 35 },
          { time: '17:00', available: true, price: 35 },
          { time: '18:00', available: false, price: 40 },
          { time: '19:00', available: true, price: 40 },
          { time: '20:00', available: true, price: 40 }
        ]
      },
      {
        date: '2023-06-16',
        slots: [
          { time: '09:00', available: true, price: 25 },
          { time: '10:00', available: false, price: 25 },
          { time: '11:00', available: true, price: 25 },
          { time: '12:00', available: true, price: 30 },
          { time: '13:00', available: false, price: 30 },
          { time: '14:00', available: true, price: 30 },
          { time: '15:00', available: true, price: 35 },
          { time: '16:00', available: false, price: 35 },
          { time: '17:00', available: true, price: 35 },
          { time: '18:00', available: true, price: 40 },
          { time: '19:00', available: false, price: 40 },
          { time: '20:00', available: true, price: 40 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Sunset Beach Club',
    address: '456 Sunset Drive',
    city: 'San Diego',
    description: 'Beautiful beachfront sports center with professional-grade courts and amazing sunset views.',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    sports: ['beach volley', 'beach tennis', 'beach soccer'],
    location: {
      lat: 32.715736,
      lng: -117.161087
    },
    availableTimes: [
      {
        date: '2023-06-15',
        slots: [
          { time: '09:00', available: false, price: 30 },
          { time: '10:00', available: true, price: 30 },
          { time: '11:00', available: true, price: 30 },
          { time: '12:00', available: false, price: 35 },
          { time: '13:00', available: true, price: 35 },
          { time: '14:00', available: true, price: 35 },
          { time: '15:00', available: false, price: 40 },
          { time: '16:00', available: true, price: 40 },
          { time: '17:00', available: true, price: 40 },
          { time: '18:00', available: true, price: 45 },
          { time: '19:00', available: false, price: 45 },
          { time: '20:00', available: true, price: 45 }
        ]
      },
      {
        date: '2023-06-16',
        slots: [
          { time: '09:00', available: true, price: 30 },
          { time: '10:00', available: true, price: 30 },
          { time: '11:00', available: false, price: 30 },
          { time: '12:00', available: true, price: 35 },
          { time: '13:00', available: true, price: 35 },
          { time: '14:00', available: true, price: 35 },
          { time: '15:00', available: false, price: 40 },
          { time: '16:00', available: true, price: 40 },
          { time: '17:00', available: true, price: 40 },
          { time: '18:00', available: false, price: 45 },
          { time: '19:00', available: true, price: 45 },
          { time: '20:00', available: true, price: 45 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Golden Sands Sports Center',
    address: '789 Golden Ave',
    city: 'Los Angeles',
    description: 'Modern sports facility with top-notch amenities and professional coaching available.',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    sports: ['beach volley', 'beach tennis', 'beach soccer', 'beach handball'],
    location: {
      lat: 34.052235,
      lng: -118.243683
    },
    availableTimes: [
      {
        date: '2023-06-15',
        slots: [
          { time: '09:00', available: true, price: 35 },
          { time: '10:00', available: false, price: 35 },
          { time: '11:00', available: true, price: 35 },
          { time: '12:00', available: true, price: 40 },
          { time: '13:00', available: false, price: 40 },
          { time: '14:00', available: true, price: 40 },
          { time: '15:00', available: true, price: 45 },
          { time: '16:00', available: true, price: 45 },
          { time: '17:00', available: false, price: 45 },
          { time: '18:00', available: true, price: 50 },
          { time: '19:00', available: true, price: 50 },
          { time: '20:00', available: false, price: 50 }
        ]
      },
      {
        date: '2023-06-16',
        slots: [
          { time: '09:00', available: false, price: 35 },
          { time: '10:00', available: true, price: 35 },
          { time: '11:00', available: true, price: 35 },
          { time: '12:00', available: false, price: 40 },
          { time: '13:00', available: true, price: 40 },
          { time: '14:00', available: true, price: 40 },
          { time: '15:00', available: true, price: 45 },
          { time: '16:00', available: false, price: 45 },
          { time: '17:00', available: true, price: 45 },
          { time: '18:00', available: true, price: 50 },
          { time: '19:00', available: true, price: 50 },
          { time: '20:00', available: false, price: 50 }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Palm Beach Sports',
    address: '101 Palm Street',
    city: 'Fort Lauderdale',
    description: 'Family-friendly sports center with courts for all ages and skill levels.',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1533552755457-5b471cb2ab11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    sports: ['beach volley', 'beach tennis'],
    location: {
      lat: 26.122308,
      lng: -80.143379
    },
    availableTimes: [
      {
        date: '2023-06-15',
        slots: [
          { time: '09:00', available: true, price: 20 },
          { time: '10:00', available: true, price: 20 },
          { time: '11:00', available: true, price: 20 },
          { time: '12:00', available: false, price: 25 },
          { time: '13:00', available: true, price: 25 },
          { time: '14:00', available: true, price: 25 },
          { time: '15:00', available: false, price: 30 },
          { time: '16:00', available: true, price: 30 },
          { time: '17:00', available: true, price: 30 },
          { time: '18:00', available: true, price: 35 },
          { time: '19:00', available: false, price: 35 },
          { time: '20:00', available: true, price: 35 }
        ]
      },
      {
        date: '2023-06-16',
        slots: [
          { time: '09:00', available: false, price: 20 },
          { time: '10:00', available: true, price: 20 },
          { time: '11:00', available: true, price: 20 },
          { time: '12:00', available: true, price: 25 },
          { time: '13:00', available: false, price: 25 },
          { time: '14:00', available: true, price: 25 },
          { time: '15:00', available: true, price: 30 },
          { time: '16:00', available: true, price: 30 },
          { time: '17:00', available: false, price: 30 },
          { time: '18:00', available: true, price: 35 },
          { time: '19:00', available: true, price: 35 },
          { time: '20:00', available: true, price: 35 }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'Coastal Sports Hub',
    address: '222 Coastal Highway',
    city: 'Santa Monica',
    description: 'Premium sports facility with ocean views and state-of-the-art equipment.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    sports: ['beach volley', 'beach tennis', 'beach soccer'],
    location: {
      lat: 34.019454,
      lng: -118.491191
    },
    availableTimes: [
      {
        date: '2023-06-15',
        slots: [
          { time: '09:00', available: false, price: 40 },
          { time: '10:00', available: true, price: 40 },
          { time: '11:00', available: true, price: 40 },
          { time: '12:00', available: true, price: 45 },
          { time: '13:00', available: false, price: 45 },
          { time: '14:00', available: true, price: 45 },
          { time: '15:00', available: true, price: 50 },
          { time: '16:00', available: false, price: 50 },
          { time: '17:00', available: true, price: 50 },
          { time: '18:00', available: true, price: 55 },
          { time: '19:00', available: true, price: 55 },
          { time: '20:00', available: false, price: 55 }
        ]
      },
      {
        date: '2023-06-16',
        slots: [
          { time: '09:00', available: true, price: 40 },
          { time: '10:00', available: false, price: 40 },
          { time: '11:00', available: true, price: 40 },
          { time: '12:00', available: true, price: 45 },
          { time: '13:00', available: true, price: 45 },
          { time: '14:00', available: false, price: 45 },
          { time: '15:00', available: true, price: 50 },
          { time: '16:00', available: true, price: 50 },
          { time: '17:00', available: true, price: 50 },
          { time: '18:00', available: false, price: 55 },
          { time: '19:00', available: true, price: 55 },
          { time: '20:00', available: true, price: 55 }
        ]
      }
    ]
  }
]; 