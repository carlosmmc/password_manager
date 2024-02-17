## Project Structure

This document outlines the structure of the project, providing details on key files and directories.

## Root Directory

- `README.md`: Main documentation for the repository/project.
- `images`: Contains images used in the project documentation.
- `.gitignore`: Standard git ignore file for safely working with remote repository.

## Backend

The backend of our application, implemented with Flask, handles both backend logic and serving frontend files at this stage.

- `backend/`
  - `api/`: Contains the API endpoints for the application.
    - `accounts.py`, `credentials.py`: Implements our API's.
    - `helpers.py`: File with helper methods used in the API implementations.
  - `db/`: Houses helper code for database connections.
    - `cloud_sql.py`: Logic to connect to Cloud SQL, including example queries and methods.
    - `firebase.py`: Contains logic for Firebase connection.
    - `create_tables.sql`: For creating and seeding tables with sample data.
  - `app.yaml`: Configures Google Cloud Platform (GCP) App Engine deploys.
  - `index.yaml`: Declares indexes for Firebase.
  - `main.py`: Entry point of the application, defining Flask routes.
  - `middleware/`: Contains middleware, such as authentication.
    - `auth.py`: Implements authentication middleware for Flask, checking user login status before requests.
    - `api_observability.py`: Implements logging used throughout the backend.
  - `requirements.txt`: Lists Python package dependencies for the project.
  - `tests/`: Contains test files, like Postman collections for API testing.

## Frontend

The frontend directory contains the React application, including its setup, components, and assets.

- `frontend/`
  - `package-lock.json`, `package.json`: These files manage the project's dependencies, scripts, and overall metadata for the npm package.
  - `public/`: Holds static files served by the React app.
    - `favicon.ico`: The website's favicon, displayed in the browser tab.
    - `index.html`: The main HTML file where the React app is rendered.
    - `manifest.json`: Contains metadata used when your web app is added to the home screen on a mobile device.
    - `robots.txt`: Provides instructions to web crawlers about the site, such as which pages should not be indexed.
  - `src/`: Contains the source code for the React application.
    - `App.css`: The main CSS file for styling the App component.
    - `App.js`: The root React component that represents the core layout of the application.
    - `App.test.js`: Contains tests for the App component.
    - `bootstrap.min.css`: Minified Bootstrap CSS for styling.
    - `components/`: Reusable React components used throughout the application.
      - `AccountDetails.jsx`, `AccountList.jsx`, `EditApp.jsx`, `footer.jsx`, `header.jsx`: Specific components for account management, editing applications, layout, etc.
    - `firebase.js`: Configures and initializes Firebase within the React app.
    - `helpers.js`, `hooks.js`: Utility functions and custom React hooks for shared logic.
    - `index.css`: Global CSS styles.
    - `index.js`: Entry point for the React application, where the root component is rendered.
    - `logo.svg`: A logo used in the React app.
    - `pages/`: Components representing entire pages within the app, routing targets.
      - `AccountOverviewPage.jsx`, `HomePage.jsx`: Pages for account overview and the home page.
    - `randomPassword.js`: Utility for generating random passwords.
    - `reportWebVitals.js`: Tool for measuring the performance of the app.
    - `sampledata.js`: Contains sample data for development or testing.
    - `setupTests.js`: Configures the testing environment.
