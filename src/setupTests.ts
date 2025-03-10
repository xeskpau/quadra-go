import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

// Mock the window.matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the window.scrollTo function
window.scrollTo = jest.fn();

// Mock the window.alert function
window.alert = jest.fn();

// Mock the window.confirm function
window.confirm = jest.fn(() => true);

// Mock the window.open function
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn().mockReturnValue(null),
});

// Mock the window.location.reload function
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    ...window.location,
    reload: jest.fn(),
  },
});

// Mock the IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  callback: IntersectionObserverCallback;
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock the ResizeObserver
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  callback: ResizeObserverCallback;
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
  } as Response)
);

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