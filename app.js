import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

import { auth, db } from "./firebaseConfig.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Function to add user data to Firestore after sign-up
let addUserData = async (user) => {
    try {
        await addDoc(collection(db, "users"), {
            email: user.email,
            uid: user.uid
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// Sign-Up Function
let signUpUser = async (email, password) => {
    try {
        if (!email || !password) {
            alert("Email and Password cannot be empty!");
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await addUserData(user); 
        
        alert("Sign-Up Successful!");
        localStorage.setItem("loggedInUser", user.uid);
        window.location.replace("./dashboard.html");
    } catch (error) {
        alert("Sign-Up Error: " + error.message);
        console.error(error.code, error.message);
    }
};

// Login Function
let signIn = async (email, password) => {
    try {
        if (!email || !password) {
            alert("Email and Password cannot be empty!");
            return;
        }
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert("Login Successful!");
        localStorage.setItem("loggedInUser", user.uid);
        window.location.replace("./dashboard.html");
    } catch (error) {
        alert("Login Error: " + error.message);
        console.error(error.code, error.message);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    let loginBtn = document.querySelector("#login-btn");
    let signUpBtn = document.querySelector("#signUp-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            let email = document.querySelector("#email").value.trim();
            let password = document.querySelector("#password").value.trim();
            signIn(email, password);
        });
    }

    if (signUpBtn) {
        signUpBtn.addEventListener("click", () => {
            let email = document.querySelector("#email").value.trim();
            let password = document.querySelector("#password").value.trim();
            signUpUser(email, password);
        });
    }
});
