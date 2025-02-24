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
      e.preventDefault(); // Prevents page refresh

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !email || !password) {
        alert("⚠️ All fields are required!");
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
        localStorage.setItem("loggedInUsername", username); // Save username
        alert("✅ Account created successfully!");
        window.location.href = "dashboard.html"; 
      } catch (error) {
        console.error("Signup Error:", error);
        alert(`❌ Error: ${error.message}`);
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
        alert("⚠️ Email and Password cannot be empty!");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user details from Firestore
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
        alert(`❌ Login Error: ${error.message}`);
      }
    });
  }
});
