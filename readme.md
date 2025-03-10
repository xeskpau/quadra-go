# QuadraGo - Sports Center Marketplace

QuadraGo is a web application that connects players with sports centers nearby. It allows users to find and book sports facilities for various activities like beach volleyball, tennis, soccer, and more.

## Features

### Current Features

- **User Authentication**
  - Email/password login and registration
  - Google authentication
  - User profile display

- **Sports Center Discovery**
  - List view of sports centers with details
  - Map view showing sports center locations
  - Filtering by sport, date, and time

- **Booking Management**
  - View available time slots
  - Book slots for specific sports and times

### Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Styled Components
- **Routing**: React Router
- **Maps**: React Leaflet
- **Authentication**: Simulated (will be replaced with Firebase)
- **Testing**: Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sports-center-marketplace.git
   cd sports-center-marketplace
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── sportsCenters/  # Sports center related components
├── context/            # React context providers
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and mock data
```

## Testing

See [testing.md](./testing.md) for details on the testing strategy and test cases.

To run tests:

```bash
npm test
```

## Next Steps

1. **Backend Integration**
   - Replace mock data with real API calls
   - Implement proper authentication with Firebase

2. **Sports Center Portal**
   - Create a separate login for sports centers
   - Allow sports centers to manage their profiles and available slots
   - Enable sports centers to view and manage bookings

3. **Enhanced User Features**
   - User booking history
   - Favorite sports centers
   - Ratings and reviews
   - Social features to connect with other players

4. **Mobile Responsiveness**
   - Optimize the UI for mobile devices
   - Consider developing native mobile apps

5. **Payment Integration**
   - Add payment processing for bookings
   - Implement booking cancellation and refund policies
