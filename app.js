import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

//  sign up 
let signUpUser = async (name, email, password, phone, photoURL) => {
    try {
        if (!name || !email || !password || !phone || !photoURL) {
            alert("All fields are required!");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: name,
            photoURL: photoURL
        });

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: name,
            email: email,
            phoneNumber: phone,
            photoURL: photoURL
        });

        alert("Sign-Up Successful!");
        localStorage.setItem("loggedInUser", user.uid);
        window.location.replace("./dashboard.html");
    } catch (error) {
        alert("Sign-Up Error: " + error.message);
        console.error(error.code, error.message);
    }
};

// sign in
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
    const signUpBtn = document.querySelector("#signUp-btn");
    const loginBtn = document.querySelector("#login-btn");

    if (signUpBtn) {
        signUpBtn.addEventListener("click", () => {
            let name = document.querySelector("#name").value.trim();
            let email = document.querySelector("#email").value.trim();
            let password = document.querySelector("#password").value.trim();
            let phone = document.querySelector("#phone").value.trim();
            let photoURL = document.querySelector("#photo").value.trim();
            signUpUser(name, email, password, phone, photoURL);
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
