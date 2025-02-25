import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

//  user data to Firestore
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

//  Sign Up User
let signUpUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await addUserData(user);
        localStorage.setItem("loggedInUser", user.uid);
        
        alert("Sign Up Successful! Redirecting to dashboard...");
        window.location.replace("./dashboard.html");
    } catch (error) {
        console.error("Signup error:", error.message);
        alert(`Sign Up Failed: ${error.message}`);
    }
};

//  Sign In User
let signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("loggedInUser", user.uid);

        alert("Login Successful! Redirecting to dashboard...");
        window.location.replace("./dashboard.html");
    } catch (error) {
        console.error("Login error:", error.message);
        alert(`Login Failed: ${error.message}`);
    }
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    let signUpBtn = document.querySelector("#signUp-btn");
    let loginBtn = document.querySelector("#login-btn");

    if (signUpBtn) {
        signUpBtn.addEventListener("click", () => {
            let email = document.querySelector("#email").value;
            let password = document.querySelector("#password").value;
            
            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }
            
            signUpUser(email, password);
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            let email = document.querySelector("#email").value;
            let password = document.querySelector("#password").value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            signIn(email, password);
        });
    }
});
