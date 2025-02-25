import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZpZWIJ0mLgOqAzMC5jMbBdOgAgn_rL2M",
    authDomain: "ecommerce-19ff4.firebaseapp.com",
    projectId: "ecommerce-19ff4",
    storageBucket: "ecommerce-19ff4.firebasestorage.app",
    messagingSenderId: "521272247200",
    appId: "1:521272247200:web:7996007c1a00fe39ecdac5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
