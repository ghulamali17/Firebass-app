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
        console.error("Error adding document: ", e);
    }
};

let signUpUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await addUserData(user);
        localStorage.setItem("loggedInUser", user.uid);
        window.location.replace("./dashboard.html");
    } catch (error) {
        console.error(error.code, error.message);
    }
};

let signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("loggedInUser", user.uid);
        window.location.replace("./dashboard.html");
    } catch (error) {
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
