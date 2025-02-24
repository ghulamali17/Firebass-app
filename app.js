import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  doc, 
  setDoc, 
  getDoc
} from "./firebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {

  // ===================== SIGN UP FUNCTION =====================
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

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

        await setDoc(doc(db, "users", user.uid), {
          username,
          email,
          uid: user.uid
        });

        localStorage.setItem("loggedInUser", JSON.stringify({ uid: user.uid, username }));
        alert("✅ Sign Up Successful!");
        window.location.href = "dashboard.html";
      } catch (error) {
        alert(`❌ Error: ${error.message}`);
      }
    });
  }

  // ===================== SIGN IN FUNCTION =====================
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("⚠️ Email and Password are required!");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          localStorage.setItem("loggedInUser", JSON.stringify({ uid: user.uid, username: userDoc.data().username }));
          alert("✅ Login Successful!");
          window.location.href = "dashboard.html";
        } else {
          alert("⚠️ No user data found! Try signing up.");
        }
      } catch (error) {
        alert(`❌ Login Error: ${error.message}`);
      }
    });
  }
});
