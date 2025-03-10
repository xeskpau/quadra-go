#!/bin/bash

# Script to test GitHub Actions locally using act
# Usage: ./scripts/test-actions.sh [workflow_file]

# Create directory if it doesn't exist
mkdir -p scripts

# Default workflow file
WORKFLOW_FILE=".github/workflows/pre-push.yml"

# If argument is provided, use it as the workflow file
if [ "$1" != "" ]; then
  WORKFLOW_FILE="$1"
fi

# Check if act is installed
if ! command -v act &> /dev/null; then
  echo "Error: 'act' is not installed. Please install it first:"
  echo "  curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash"
  exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
  echo "Error: Docker is not running. Please start Docker first."
  exit 1
fi

# Create a simple .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file for testing..."
  cat > .env.local << EOL
REACT_APP_FIREBASE_API_KEY=test-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=test-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=test-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=test-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
REACT_APP_FIREBASE_MEASUREMENT_ID=G-TESTID
EOL
fi

echo "Running GitHub Actions workflow: $WORKFLOW_FILE"
act -W "$WORKFLOW_FILE" --container-architecture linux/amd64

exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "✅ GitHub Actions workflow passed!"
else
  echo "❌ GitHub Actions workflow failed with exit code: $exit_code"
fi

exit $exit_code 