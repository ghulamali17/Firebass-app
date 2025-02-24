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

document.addEventListener("DOMContentLoaded", () => {
  
  // ===================== SIGN UP FUNCTION =====================
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent page reload

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Check if fields are empty
      if (!username || !email || !password) {
        alert("⚠️ All fields are required!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
          username,
          email,
          createdAt: serverTimestamp(),
          uid: user.uid,
        };

        await setDoc(doc(db, "users", user.uid), userData);

        // Save to localStorage
        localStorage.setItem("loggedInUserUID", user.uid);
        localStorage.setItem("loggedInUsername", username);

        alert("✅ Account created successfully!");
        window.location.href = "dashboard.html"; 
      } catch (error) {
        console.error("Signup Error:", error);

        // Show user-friendly error messages
        if (error.code === "auth/email-already-in-use") {
          alert("⚠️ This email is already in use. Please log in.");
        } else if (error.code === "auth/weak-password") {
          alert("⚠️ Password is too weak! Use at least 6 characters.");
        } else if (error.code === "auth/invalid-email") {
          alert("⚠️ Invalid email format! Please enter a valid email.");
        } else {
          alert(`❌ Error: ${error.message}`);
        }
      }
    });
  }

  // ===================== LOGIN FUNCTION =====================
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent page reload

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("⚠️ Email and Password cannot be empty!");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          localStorage.setItem("loggedInUserUID", user.uid);
          localStorage.setItem("loggedInUsername", userDoc.data().username);
          alert("✅ Login Successful!");
          window.location.href = "dashboard.html";
        } else {
          alert("⚠️ No user data found! Try signing up.");
        }
      } catch (error) {
        console.error("Login Error:", error);

        // Handle different errors
        if (error.code === "auth/user-not-found") {
          alert("⚠️ No account found with this email. Sign up first.");
        } else if (error.code === "auth/wrong-password") {
          alert("⚠️ Incorrect password! Please try again.");
        } else {
          alert(`❌ Login Error: ${error.message}`);
        }
      }
    });
  }
});
