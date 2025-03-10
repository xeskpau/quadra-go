/// <reference types="cypress" />

// Declare the mockFirebaseUser property on Window interface
declare global {
  interface Window {
    mockFirebaseUser?: {
      uid: string;
      email: string;
      displayName: string;
      photoURL: string;
      emailVerified: boolean;
    };
  }
}

// Example custom command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

// Mock Firebase authentication
Cypress.Commands.add('mockFirebase', () => {
  // Mock the Firebase auth object
  cy.window().then((win) => {
    // Create a mock user
    win.mockFirebaseUser = {
      uid: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      emailVerified: true
    };
  });
});

// Add type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in with email and password
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): void;
      
      /**
       * Custom command to mock Firebase authentication
       * @example cy.mockFirebase()
       */
      mockFirebase(): void;
    }
  }
} 