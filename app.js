import { auth, db } from "./firebaseConfig.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// ===================== SIGN UP =====================
document.getElementById("signup-btn").addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!email || !password) {
        alert("⚠️ Email and Password are required!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            email,
            createdAt: serverTimestamp(),
            uid: user.uid
        });

        localStorage.setItem("loggedInUser", JSON.stringify({ email, uid: user.uid }));
        alert("✅ Account created successfully!");
        window.location.href = "dashboard.html"; 
    } catch (error) {
        alert(` Error: ${error.message}`);
    }
});

// ===================== LOGIN =====================
document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
        alert("⚠️ Email and Password cannot be empty!");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            localStorage.setItem("loggedInUser", JSON.stringify(userDoc.data()));
            alert("✅ Login Successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("⚠️ No user data found! Try signing up.");
        }
    } catch (error) {
        alert(` Login Error: ${error.message}`);
    }
});
