import { 
  auth, 
  db 
} from "./firebaseConfig.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  
  // ===================== SIGN UP FUNCTION =====================
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const username = document.getElementById("username").value.trim();

      if (!username || !email || !password) {
        alert("All fields are required!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
          username: username,
          email: email,
          createdAt: serverTimestamp(),
          uid: user.uid,
        };

        await setDoc(doc(db, "users", user.uid), userData);

        localStorage.setItem("loggedInUserUID", user.uid);
        alert("Account created successfully!");
        window.location.href = "dashboard.html"; 
      } catch (error) {
        console.error(error.code, error.message);
        alert(`Error: ${error.message}`);
      }
    });
  }

  // ===================== LOGIN FUNCTION =====================
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Email and Password cannot be empty!");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        localStorage.setItem("loggedInUserUID", user.uid);
        alert("Login Successful!");
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error(error.code, error.message);
        alert(`Login Error: ${error.message}`);
      }
    });
  }

});
