import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; // Import Firebase Authentication 
import firebaseConfig from './firebaseConfig.js'

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
