import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 
    "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { addDoc, collection } from 
    "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

let addUserData = async (user) => {
    try {
        await addDoc(collection(db, "users"), {
            email: user.email,
            uid: user.uid,
        });
    } catch (e) {
        alert("Error adding user data: " + e.message);
        console.error("Error adding document: ", e);
    }
};

let signUpUser = async (email, password) => {
    try {
        if (!email || !password) {
            alert("Email and Password cannot be empty!");
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await addUserData(user);
        localStorage.setItem("loggedInUser", user.uid);
        alert("Sign Up Successful!");
        window.location.replace("./dashboard.html");
    } catch (error) {
        alert("Sign Up Error: " + error.message);
        console.error(error.code, error.message);
    }
};

let signIn = async (email, password) => {
    try {
        if (!email || !password) {
            alert("Email and Password cannot be empty!");
            return;
        }
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("loggedInUser", user.uid);
        alert("Login Successful!");
        window.location.replace("./dashboard.html");
    } catch (error) {
        alert("Login Error: " + error.message);
        console.error(error.code, error.message);
    }
};

document.querySelector("#signUp-btn").addEventListener("click", () => {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    signUpUser(email, password);
});

document.querySelector("#login-btn").addEventListener("click", () => {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    signIn(email, password);
});
