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
