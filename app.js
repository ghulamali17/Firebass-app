import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Function to sign up a new user
let signUpUser = async (name, email, password, phone) => {
    try {
        if (!name || !email || !password || !phone) {
            alert("All fields are required!");
            return;
        }

        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Firebase Auth Profile with Name
        await updateProfile(user, { displayName: name });

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: name,
            email: email,
            phoneNumber: phone
        });

        alert("Sign-Up Successful!");
        localStorage.setItem("loggedInUser", user.uid);
        window.location.replace("./dashboard.html");
    } catch (error) {
        alert("Sign-Up Error: " + error.message);
        console.error(error.code, error.message);
    }
};

// Function to sign in an existing user
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

// Attach event listeners after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const signUpBtn = document.querySelector("#signUp-btn");
    const loginBtn = document.querySelector("#login-btn");

    if (signUpBtn) {
        signUpBtn.addEventListener("click", () => {
            let name = document.querySelector("#name").value.trim();
            let email = document.querySelector("#email").value.trim();
            let password = document.querySelector("#password").value.trim();
            let phone = document.querySelector("#phone").value.trim();
            signUpUser(name, email, password, phone);
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            let email = document.querySelector("#email").value.trim();
            let password = document.querySelector("#password").value.trim();
            signIn(email, password);
        });
    }
});
