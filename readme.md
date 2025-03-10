# QuadraGo - Sports Center Marketplace

[![CI](https://github.com/xeskpau/quadra-go/actions/workflows/main.yml/badge.svg)](https://github.com/xeskpau/quadra-go/actions/workflows/main.yml)

QuadraGo is a web application that connects players with sports centers nearby. It allows users to find and book sports facilities for various activities like beach volleyball, tennis, soccer, and more.

## Features

### Current Features

-   **User Authentication**
    -   Email/password login and registration
    -   Google authentication
    -   User profile display

-   **Sports Center Discovery**
    -   List view of sports centers with details
    -   Map view showing sports center locations
    -   Filtering by sport, date, and time

-   **Booking Management**
    -   View available time slots
    -   Book slots for specific sports and times

### Tech Stack

-   **Frontend**: React with TypeScript
-   **Styling**: Styled Components
-   **Routing**: React Router
-   **Maps**: React Leaflet
-   **Authentication**: Firebase (Replaced simulated authentication)
-   **Testing**: Jest, React Testing Library, and Cypress

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   npm or yarn
-   Docker (for running GitHub Actions locally with `act`)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/sports-center-marketplace.git
    cd sports-center-marketplace
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**

    Before running the application, you need to set up your environment variables:
    
    a. Copy `.env.example` to create a new `.env` file:

    ```bash
    cp .env.example .env
    ```

    b. Fill in your Firebase configuration values in the `.env` file:

    ```
    REACT_APP_FIREBASE_API_KEY=your_api_key_here
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

    **Note:** Never commit the `.env` file to version control. It contains sensitive information.  The `.gitignore` file is already configured to exclude `.env` files.

4.  Start the development server:

    ```bash
    npm start
    # or
    yarn start
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

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

See [testing.md](./testing.md) for detailed information on the testing strategy and test cases. QuadraGo utilizes a comprehensive testing approach including unit, integration, and end-to-end (E2E) tests.

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Open Cypress Test Runner
npm run cypress:open
```

### Pre-Push Testing (Git Hooks)

The project is configured with Git hooks to ensure code quality:

1.  **Pre-commit Hook**:  Runs tests for files being committed.
2.  **Pre-push Hook**: Runs all tests before pushing to the remote repository.

These hooks help catch issues early in the development process.

### Testing GitHub Actions Locally (using `act`)

You can test GitHub Actions workflows locally before pushing to GitHub using the `act` tool:

1.  Install `act` and ensure Docker is running:

    ```bash
    # Install act
    curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

    # Make sure Docker is running
    docker info
    ```

2.  Run the test script:

    ```bash
    # Test the pre-push workflow (default)
    ./scripts/test-actions.sh

    # Test a specific workflow file
    ./scripts/test-actions.sh .github/workflows/main.yml
    ```
### Testing GitHub Actions on GitHub (Without Merging)
You can also test changes to your GitHub Actions on a branch, before merging, using the following steps:

1.  Push *only* the workflow file changes to your branch:

    ```bash
    git add .github/workflows/pre-push.yml  # Or the specific workflow file
    git commit -m "Update workflow file"
    git push
    ```

2.  Go to the GitHub repository > Actions > "Pre-Push Tests" workflow (or the name of your workflow).
3.  Click "Run workflow" and select your branch.
4.  Review the results before pushing your code changes.

## Branch Protection
The `main` branch is protected with these rules:
1. Require status checks to pass before merging.
2. Require branches to be up to date before merging.
This workflow guarantees the pass of all tests before merging the code.

## Next Steps

1.  **Backend Integration**
    *   ~Replace mock data with real API calls~ (Done, using Firebase)
    *   ~Implement proper authentication with Firebase~ (Done)

2.  **Sports Center Portal**
    *   Create a separate login for sports centers.
    *   Allow sports centers to manage their profiles and available slots.  Create 10 mock sports centers accounts and fill them with mock information. All should be based in California.
    *   Enable sports centers to view and manage bookings
    *   **Dynamic Pricing:** Allow sports centers to adjust pricing based on demand, time of day, day of the week, or special events.
    *   **Promotions and Discounts:** Enable sports centers to create and manage promotional offers.
    *   **Detailed Analytics:** Provide dashboards showing booking trends, revenue, popular time slots, customer demographics, etc.
    *   **Staff Management:** Allow sports centers to manage staff accounts and assign roles/permissions.
    *   **Inventory Management:** If the center rents equipment, integrate a system for tracking inventory and availability.
    *   **Customer Relationship Management (CRM):** Basic CRM features.
    *   **Multi-Location Management:** Manage multiple locations under one account.

3.  **Enhanced User Features**
    *   User booking history
    *   Favorite sports centers
    *   Ratings and reviews
    *   Social features to connect with other players
    *   **Waiting Lists:** Allow users to join a waiting list for fully booked slots.
    *   **Group Bookings:** Facilitate booking for multiple players, including payment splitting and attendee management.
    *   **Booking Modifications:** Allow users to modify existing bookings (e.g., change time, add players).
    *   **Calendar Integration:** Sync bookings with personal calendars (Google Calendar, iCal, etc.).
    *   **Automated Reminders:** Send email/SMS/push notifications for upcoming bookings.
    *   **Partial Cancellations:** Allow cancellation of individual spots within a multi-spot reservation.
    * **Personalized Recommendations**: Suggest centers, and activities based on various factors.
    * **"You may also like..." suggestions.**

4.  **Mobile Responsiveness**
    *   Optimize the UI for mobile devices
    *   Consider developing native mobile apps

5.  **Payment Integration**
    *   Add payment processing for bookings
    *   Implement booking cancellation and refund policies

6.  **Advanced Search and Filtering:**
    *   **Distance-based Search:** Allow users to specify a search radius.
    *   **Amenity Filtering:** Filter by specific amenities (parking, showers, etc.).
    *   **Accessibility Filtering:** Options for users with specific accessibility needs.
    *   **Price Range Filtering:** Filter by the price of booking slots.
    *   **Availability Search Refinement:** Search across multiple dates/times or for recurring bookings.
    *   **"Open Now" Filter:** Show centers with immediate availability.

7.  **Social Features (Expanded):**
    *   **Friend Lists:** Connect with friends and see their activity.
    *   **Activity Feeds:** Show recent bookings and activity from friends/network.
    *   **Team/Group Formation:** Tools to find and join teams/groups.
    *   **Messaging:** In-app messaging between users and/or sports centers.
    *   **Challenges and Leaderboards:** Gamified features.

8.  **Improved Onboarding:**
    *   Interactive tutorials.
    *   Clearer explanations of features.
    *   Personalized onboarding.

9. **Review System Enhancements:**
    * More detailed rating criteria.
    * Verified reviews (only from users with bookings).
    * Photo/video uploads with reviews.
    * Sports center response system.

10. **Platform and Infrastructure:**
    *   **Internationalization (i18n) and Localization (l10n):** Support multiple languages and regional formats.
    *   **Performance Optimization:** Continuous monitoring and optimization.
    *   **Scalability:** Ensure the backend can handle growth.
    *   **Security Enhancements:** Regular audits, data protection, and 2FA.
    *   **API for Third-Party Integrations:** Allow other applications to connect.

11. **Business & Monetization**
    *   **Partnerships**
    *  **Premium Features (Freemium model).**
    *   **Advertising (Carefully Considered):** Explore non-intrusive advertising options.