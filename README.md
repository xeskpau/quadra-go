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