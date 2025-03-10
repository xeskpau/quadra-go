# QuadraGo - Sports Center Marketplace

[![CI](https://github.com/xeskpau/quadra-go/actions/workflows/main.yml/badge.svg)](https://github.com/xeskpau/quadra-go/actions/workflows/main.yml)

QuadraGo is a web application that connects players with sports centers nearby. It allows users to find and book sports facilities for various activities like beach volleyball, tennis, soccer, and more.

## Environment Setup

Before running the application, you need to set up your environment variables:

1. Copy `.env.example` to create a new `.env` file:
```bash
cp .env.example .env
```

2. Fill in your Firebase configuration values in the `.env` file:
```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note:** Never commit the `.env` file to version control. It contains sensitive information. The `.gitignore` file is already configured to exclude `.env` files. 

## Testing

QuadraGo uses a comprehensive testing approach with unit tests, integration tests, and end-to-end tests. For more details, see [testing.md](testing.md).

### Running Tests Locally

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

### Pre-Push Testing

The project is configured with Git hooks to run tests automatically:

1. **Pre-commit Hook**: Runs tests for files being committed
2. **Pre-push Hook**: Runs all tests before pushing to remote

These hooks help catch issues early in the development process.

### Testing GitHub Actions Locally

You can test GitHub Actions workflows locally before pushing to GitHub using the `act` tool:

1. Install `act` and Docker:
   ```bash
   # Install act
   curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
   
   # Make sure Docker is running
   docker info
   ```

2. Run the test script:
   ```bash
   # Test the pre-push workflow
   ./scripts/test-actions.sh
   
   # Test a specific workflow
   ./scripts/test-actions.sh .github/workflows/main.yml
   ```

### Testing GitHub Actions on GitHub

You can also test your changes using GitHub Actions without merging to the main branch:

1. Push only the workflow file to your branch:
   ```bash
   git add .github/workflows/pre-push.yml
   git commit -m "Update workflow file"
   git push
   ```

2. Go to the GitHub repository > Actions > "Pre-Push Tests" workflow
3. Click "Run workflow" and select your branch
4. Review the results before pushing your code changes

## Branch Protection

The main branch is protected with the following rules:

1. Require status checks to pass before merging
2. Require branches to be up to date before merging

This ensures that all tests pass before code is merged into the main branch. 