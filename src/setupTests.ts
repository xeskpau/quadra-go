import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})) as unknown as (query: string) => MediaQueryList;

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: jest.fn(),
    };
  }
}

window.IntersectionObserver = IntersectionObserver as unknown as typeof window.IntersectionObserver;

// Mock ResizeObserver
class ResizeObserver {
  constructor() {
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    };
  }
}

window.ResizeObserver = ResizeObserver as unknown as typeof window.ResizeObserver;

// Mock firebase
jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => ({})),
    signInWithPopup: jest.fn(() => Promise.resolve({ user: {} })),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(() => jest.fn()),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
    GoogleAuthProvider: jest.fn(() => ({})),
  };
}); 