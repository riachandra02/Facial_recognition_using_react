# Face Recognition System - README

## Overview

This project is a face recognition system built using React, Firebase, and the face-api.js library. The system captures video from a webcam, detects and recognizes faces using pre-trained models, and authenticates users based on stored images in Firebase Storage.

## Features

- **Face Detection and Recognition:** Utilizes face-api.js models to detect and recognize faces in real-time from webcam video.
- **Firebase Integration:** Uses Firebase for storing and retrieving images for face recognition.
- **Progress and Status Modals:** Displays progress and status information through modals and progress bars.
- **Guidelines for Best Results:** Provides users with guidelines for optimal face recognition performance.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and project setup

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/face-recognition-system.git
   cd face-recognition-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Firebase:**
   - Create a Firebase project on [Firebase Console](https://console.firebase.google.com/).
   - Obtain your Firebase config object and replace the placeholder in the `useEffect` hook in `Analyze.js`.

4. **Download face-api.js models:**
   - Download the models from the face-api.js GitHub repository and place them in the `public/models` directory.

## Running the Application

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:3000` to view the application.

## Usage

1. **Opening the Webcam:**
   - Click the "Open Webcam" button to start video capture and face recognition.
   - Follow the guidelines provided for the best recognition results.

2. **Recognition Process:**
   - The system will attempt to detect and recognize faces from the video stream.
   - If a face is detected and recognized, a success message will be displayed, and you will be redirected to the appropriate page.
   - If no face is detected or the face is not recognized, appropriate modals will inform you to try again or indicate authentication failure.

## Project Structure

```
face-recognition-system/
│
├── public/
│   ├── models/                    # Face-api.js models
│   └── index.html                 # Main HTML file
│
├── src/
│   ├── components/
│   │   └── Analyze.js             # Main component for face recognition
│   ├── App.js                     # Main application file
│   ├── index.js                   # Entry point of the application
│   └── firebase.js                # Firebase configuration (not included, needs to be created)
│
├── package.json                   # Project dependencies and scripts
└── README.md                      # This readme file
```

## Configuration

### Firebase Configuration

Replace the placeholder Firebase config object in `Analyze.js` with your actual Firebase project configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};
```

### Face-api.js Models

Download the face-api.js models from the [face-api.js GitHub repository](https://github.com/justadudewhohacks/face-api.js) and place them in the `public/models` directory.

## Contributing

Feel free to open issues or submit pull requests with improvements. Contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

This README provides a comprehensive guide to setting up and running the face recognition system. If you encounter any issues or have questions, please feel free to reach out.
