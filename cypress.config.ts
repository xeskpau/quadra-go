import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // Set environment variables for testing
      config.env = {
        ...config.env,
        CI: 'true',
        NODE_ENV: 'test',
        REACT_APP_FIREBASE_API_KEY: 'test-api-key',
        REACT_APP_FIREBASE_AUTH_DOMAIN: 'test-project-id.firebaseapp.com',
        REACT_APP_FIREBASE_PROJECT_ID: 'test-project-id',
        REACT_APP_FIREBASE_STORAGE_BUCKET: 'test-project-id.appspot.com',
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: '123456789',
        REACT_APP_FIREBASE_APP_ID: '1:123456789:web:abcdef',
        REACT_APP_FIREBASE_MEASUREMENT_ID: 'G-TESTID'
      };
      
      return config;
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
}); 