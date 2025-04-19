# Hackurway Soul Society - Backend

## Overview

This is the backend for the **Hackurway Soul Society** project, an application designed to provide a platform for users to register, log in, and access various services. The backend handles user authentication and manages user data.

## Features

- **User Authentication**: Handles user registration and login using Firebase Authentication.
- **Firestore Database**: Stores user data, such as user profile information, in Firestore.
- **Protected Routes**: Certain routes are protected using Firebase authentication tokens.
- **API Endpoints**:
  - **/register**: Allows users to create an account.
  - **/login**: Allows users to log in to their account.
  - **/user**: Fetches the user's profile data (requires authentication).

## Technologies Used

- **Node.js**: Backend framework to run the application.
- **Express.js**: Web framework for handling HTTP requests and routing.
- **Firebase**:
  - **Firebase Authentication**: For managing user authentication (signup, login).
  - **Firebase Firestore**: For storing user data.
- **dotenv**: To load environment variables.
- **firebase-admin SDK**: Admin SDK for interacting with Firebase services.

## Requirements

- **Node.js**: Make sure Node.js is installed. [Download Node.js](https://nodejs.org/en/)
- **Firebase Project**: Create a Firebase project on [Firebase Console](https://console.firebase.google.com/).
  - Enable **Firebase Authentication**.
  - Enable **Firebase Firestore**.
  - Create a service account and download the credentials JSON file.

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/Hackurway_soul_society.git
    ```

2. **Install dependencies**:

    Navigate to the project folder and run the following command:

    ```bash
    npm install
    ```

3. **Set up Firebase**:

    - Create a Firebase project if you haven't already.
    - Download the **Service Account JSON file** and add it to the project folder.
    - Add the Firebase configuration in the `.env` file. Example:

      ```
      FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", "project_id": "your-project-id", "private_key_id": "your-private-key-id", "private_key": "your-private-key", "client_email": "your-client-email", "client_id": "your-client-id", "auth_uri": "your-auth-uri", "token_uri": "your-token-uri"}'
      ```

4. **Set up the environment file**:

    Create a `.env` file in the root of the project and add the following:

    ```
    PORT=5000
    FIREBASE_SERVICE_ACCOUNT='your-firebase-service-account-json-here'
    ```

5. **Run the server**:

    After all the setup is complete, run the server using the following command:

    ```bash
    node index.js
    ```

    The server should now be running on `http://localhost:5000`.

## API Endpoints

### 1. **POST /register**
   Registers a new user with email, password, and name.

   - **Request Body**:
     ```json
     {
       "email": "user@example.com",
       "password": "password123",
       "name": "John Doe"
     }
     ```

   - **Response**:
     ```json
     {
       "message": "User registered successfully",
       "uid": "user-uid"
     }
     ```

### 2. **POST /login**
   Logs in a user using their email and password. The client should handle the password verification using Firebase SDK.

   - **Request Body**:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```

   - **Response**:
     ```json
     {
       "message": "Login successful",
       "uid": "user-uid"
     }
     ```

### 3. **GET /user**
   Fetches the authenticated user's data. Requires authentication.

   - **Headers**: `Authorization: Bearer <JWT_TOKEN>`
   
   - **Response**:
     ```json
     {
       "name": "John Doe",
       "email": "user@example.com",
       "createdAt": "2023-01-01T00:00:00Z"
     }
     ```

## Firebase Security Rules

Make sure to configure Firebase Firestore security rules to secure your user data:

```json
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow read and write if the user is authenticated and the document belongs to them
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
