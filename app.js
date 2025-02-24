import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp
} from "./firebaseConfig.js";

// ===================== SIGN UP FUNCTION =====================
document.addEventListener("DOMContentLoaded", () => {
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
        if (error.code === "auth/email-already-in-use") {
          alert("This email is already in use. Please log in.");
          window.location.href = "login.html";
        } else if (error.code === "auth/weak-password") {
          alert("Password is too weak. Please use a stronger password.");
        } else {
          alert(`Error: ${error.message}`);
        }
      }
    });
  }
});

// ===================== LOGIN FUNCTION =====================
document.addEventListener("DOMContentLoaded", () => {
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
        alert(`Login Error: ${error.message}`);
        console.error(error.code, error.message);
      }
    });
  }
});
