import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; // Import Firebase Authentication

const firebaseConfig = {
    apiKey: "AIzaSyA9sV7Bsv2tGpkoYMLAGVfgm9WDg-Ipxf4",
    authDomain: "simulation-edge.firebaseapp.com",
    projectId: "simulation-edge",
    storageBucket: "simulation-edge.appspot.com",
    messagingSenderId: "317889569561",
    appId: "1:317889569561:web:0f01e681c57ed5b7079b88",
    measurementId: "G-KR4VREMD8H"
  };
  

// Check if Firebase app with the name '[DEFAULT]' already exists
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig); // Initialize Firebase only if it doesn't exist
}

const db = firebase.firestore();
const auth = firebase.auth(); // Initialize Firebase Authentication

export { db, auth }; // Export both Firestore and Authentication

// Function to check if a user is authenticated
export function isAuthenticated() {
    return auth.currentUser !== null;
}
