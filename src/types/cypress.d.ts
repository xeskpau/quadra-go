/// <reference types="cypress" />

declare namespace Cypress {
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