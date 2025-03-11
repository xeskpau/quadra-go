# Testing Documentation

This document outlines the testing strategy and test cases for the QuadraGo application.

## Testing Strategy

The application uses a comprehensive testing approach with:
- Unit tests for individual components using Jest and React Testing Library
- Integration tests for component interactions
- End-to-end tests using Cypress for user flows

## Test Structure

```
quadra-go/
├── src/
│   ├── __tests__/
│   │   ├── App.test.tsx
│   │   ├── auth/
│   │   │   └── Login.test.tsx
│   │   └── components/
│   │       ├── SportsCenterList.test.tsx
│   │       ├── BookingForm.test.tsx
│   │       └── Map.test.tsx
│   └── setupTests.ts
└── cypress/
    ├── e2e/
    │   └── booking.cy.ts
    └── support/
        └── commands.ts
```

## Test Cases

### Unit Tests

#### Authentication Tests
- [x] User Login Test
  - Validates form rendering
  - Tests validation errors
  - Verifies successful login
  - Handles invalid credentials

#### Sports Center Tests
- [x] Sports Center Listing Test
  - Renders sports centers correctly
  - Displays center details
  - Implements filtering functionality
  - Shows available slots

#### Booking Tests
- [x] Booking Form Test
  - Validates form elements
  - Handles date selection
  - Manages time slot selection
  - Processes booking submission
  - Shows validation errors

#### Map Tests
- [x] Map Component Test
  - Renders map container
  - Displays markers correctly
  - Handles marker interactions
  - Centers on selected location

### End-to-End Tests

#### Booking Flow
- [x] Complete booking process
- [x] Error handling for unavailable slots
- [x] Sports center filtering
- [x] Map interaction and navigation

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests
```bash
# Open Cypress Test Runner
npm run cypress:open

# Run Cypress tests headlessly
npm run test:e2e
```

### Git Hooks

The project uses Husky to run tests automatically at different Git stages:

#### Pre-commit Hook
Runs unit tests for files that are being committed:
```bash
npm run test:precommit
```
This ensures that:
- Only the tests related to changed files are run
- Tests must pass before the commit is created
- Fast feedback loop for developers
- Cypress files (under cypress/ directory) are excluded from Jest testing
- The `--passWithNoTests` flag is used to handle cases where only Cypress files are changed

#### Pre-push Hook
Runs full test suite before pushing to remote:
```bash
npm run test:prepush
```
This ensures that:
- All unit tests pass
- Code coverage meets minimum requirements (80%)
- All end-to-end tests pass
- No breaking changes are pushed to the remote repository

#### Skipping Hooks

While it's technically possible to skip hooks using `--no-verify`, this should **NEVER** be done when:
- Making changes to application code
- Modifying component logic
- Changing test files
- Updating dependencies
- Refactoring code

The `--no-verify` flag should **ONLY** be used in exceptional cases such as:
```bash
# For documentation-only changes
git commit -m "docs: update README" --no-verify
git push --no-verify

# For emergency hotfixes (requires team lead approval)
# Note: Tests must still be run and pass in CI before deployment
```

> **Important**: Running tests is a critical part of our development process. Skipping tests when making code changes puts the application at risk and bypasses our quality controls. If tests are failing, fix the issues rather than bypassing the tests.

## Test Coverage Requirements

- Unit Test Coverage: 80% minimum (currently enforced in jest.config.js)
- Critical Path E2E Coverage: 100%

### Maintaining Test Coverage

To ensure tests continue to pass in CI and maintain required coverage thresholds:

1. **Test All New Code**: Write tests for any new code before or alongside implementation.

2. **Avoid DOM Attribute Warnings**: 
   - Always use camelCase for React component props
   - For DOM elements, use lowercase attribute names
   - For styled-components, use properly named props that won't conflict with HTML attributes
   - Never pass React-specific props directly to DOM elements
   - Use the `$` prefix for transient props in styled-components (e.g., `$imageUrl` instead of `imageUrl`)

3. **External Services Testing**:
   - For files like `firebase.ts` that interact with external services:
     - Create proper mock implementations that cover both success and failure paths
     - Test different environment configurations (test, CI, production)
     - Ensure conditional paths in the code are covered by tests
     - Consider excluding complex external service files from coverage calculations if necessary

4. **Common Test Coverage Gaps**:
   - Error handling branches
   - Edge cases and conditional logic
   - Initialization code
   - Authentication flows
   - Environment-specific code

5. **Before Committing**:
   - Run `npm run test:coverage` locally to verify coverage
   - Fix any failing tests
   - Address any coverage gaps (below 80%)

6. **Exempting Files from Coverage**:
   - If certain files cannot practically reach 80% coverage:
     - Document why in the PR description
     - Add to the coverage exclusion list in jest.config.js
     - Only exempt files when absolutely necessary

### Test Configuration

1. **Jest Configuration**:
   - The project uses Jest for unit and integration testing
   - Configuration is in `jest.config.js`
   - Cypress files are explicitly excluded using `testPathIgnorePatterns: ['/node_modules/', '/cypress/']`
   - This prevents Jest from attempting to run Cypress test files

2. **Pre-commit Hook Configuration**:
   - The pre-commit hook is configured to exclude Cypress files
   - It uses a grep filter (`grep -v "cypress/"`) to remove Cypress files from the list of files to test
   - This prevents Jest from running on Cypress files during pre-commit checks

### Known Testing Challenges

1. **Firebase Integration**:
   - The `firebase.ts` file is currently excluded from coverage calculations due to its complexity and external dependencies
   - When modifying this file, ensure you manually test all code paths
   - Consider adding more comprehensive mocks for Firebase services

2. **React DOM Warnings**:
   - Use the `$` prefix for styled-component props that shouldn't be passed to the DOM
   - Example: `$imageUrl` instead of `imageUrl` or `photoURL`
   - This prevents React warnings about unrecognized DOM attributes

3. **AuthContext Testing**:
   - The AuthContext has special handling for test environments
   - Some methods like `resetPassword` have simplified implementations in test mode
   - When testing these methods, be aware of the environment-specific behavior

4. **Test Environment Variables**:
   - Tests rely on proper environment variables being set
   - Ensure `NODE_ENV=test` is set when running tests
   - Mock environment variables when testing environment-specific code

5. **Mocking External Functions**:
   - When testing functions that call external services, create proper mocks
   - For imported functions that need to be mocked, use techniques like:
     ```typescript
     // Create a mock for the function
     const mockFunction = jest.fn();
     // Replace the imported function with our mock
     (importedFunction as unknown) = mockFunction;
     ```
   - Reset mocks between tests to avoid test contamination

6. **Cypress and Jest Integration**:
   - Cypress and Jest use different testing frameworks and approaches
   - Cypress files (`.cy.ts`, `.cy.js`) should not be processed by Jest
   - The pre-commit hook and Jest configuration are set up to exclude Cypress files
   - When working with Cypress tests, be aware they won't trigger Jest tests in pre-commit hooks

## Continuous Integration

The project uses GitHub Actions for automated testing and deployment. The following workflows are configured:

### Main Workflow (`main.yml`)
Triggered on:
- Pull request creation/updates targeting main branch
- Push to main branch

This workflow:
- Runs on Ubuntu with Node.js 18.x and 20.x
- Executes unit tests with coverage reporting
- Runs end-to-end tests
- Uploads test results and coverage reports
- Reports coverage to Codecov

### Scheduled Tests (`scheduled.yml`)
Runs daily at 00:00 UTC to ensure ongoing stability:
- Executes full test suite
- Runs end-to-end tests
- Creates GitHub issue if tests fail
- Helps detect environmental or dependency-related issues

### Release Workflow (`release.yml`)
Triggered when a new release is published:
- Runs full test suite
- Creates production build
- Deploys to hosting platform (e.g., GitHub Pages)
- Archives build artifacts

### CI/CD Status
All workflows must pass before:
- Merging pull requests
- Deploying to production
- Publishing new releases

Test results and artifacts are retained for:
- Coverage reports: Indefinitely on Codecov
- Build artifacts: 30 days
- Test results: Available as workflow artifacts

## Next Steps

1. [x] Implement unit tests for all components
2. [x] Set up integration tests for component interactions
3. [x] Implement end-to-end tests for critical user flows
4. [ ] Add performance testing
   - [ ] Load time measurements
   - [ ] Component rendering performance
5. [ ] Implement visual regression testing
   - [ ] Snapshot testing for UI components
   - [ ] Cross-browser compatibility tests
6. [ ] Add API contract testing
   - [ ] Mock service worker integration
   - [ ] API response validation
7. [ ] Improve Firebase testing
   - [ ] Create more comprehensive mocks for Firebase services
   - [ ] Add tests for Firebase initialization
   - [ ] Test Firebase error handling more thoroughly
8. [ ] Enhance styled-components testing
   - [ ] Add tests for theme changes
   - [ ] Test responsive design breakpoints
   - [ ] Ensure proper transient prop usage with $ prefix
