import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA4Syy5HnBB_8gLQ5g53zYjOpAYaChkTEY",
    authDomain: "form-5437b.firebaseapp.com",
    databaseURL: "https://form-5437b-default-rtdb.firebaseio.com",
    projectId: "form-5437b",
    storageBucket: "form-5437b.firebasestorage.app",
    messagingSenderId: "1066721287085",
    appId: "1:1066721287085:web:4cfdfd64352cd91e091f24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
