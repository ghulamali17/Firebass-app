import { signInWithEmailAndPassword } from 
    "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth } from "./firebaseConfig.js";

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
    document.querySelector("#login-btn").addEventListener("click", () => {
        let email = document.querySelector("#email").value.trim();
        let password = document.querySelector("#password").value.trim();
        signIn(email, password);
    });
});
