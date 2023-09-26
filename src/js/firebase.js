import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA9sV7Bsv2tGpkoYMLAGVfgm9WDg-Ipxf4",
    authDomain: "simulation-edge.firebaseapp.com",
    projectId: "simulation-edge",
    storageBucket: "simulation-edge.appspot.com",
    messagingSenderId: "317889569561",
    appId: "1:317889569561:web:0f01e681c57ed5b7079b88",
    measurementId: "G-KR4VREMD8H"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
  
const db = firebase.firestore();
  
export { db as default };

