module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/serviceWorker.ts',
    '!src/setupTests.ts',
    '!src/firebase.ts',
    '!src/utils/mockData.ts',
    '!src/components/sportsCenter/PromotionManager.tsx',
    '!src/components/sportsCenter/FacilityManager.tsx',
    '!src/components/sportsCenter/CreateSportsCenter.tsx',
    '!src/contexts/SportsCenterContext.tsx',
    '!src/components/sportsCenter/SportsCenterDashboard.tsx',
    '!src/components/sportsCenter/SportsCenterRegistration.tsx',
    '!src/components/sportsCenter/SportsCenterPortal.tsx',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
}; 