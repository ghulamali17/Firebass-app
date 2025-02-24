import { 
  addDoc, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

// Elements
let allPostDiv = document.querySelector("#allPosts");
let postInput = document.querySelector("#post-inp");
let addPostBtn = document.querySelector("#add-post");
let usernameDisplay = document.querySelector("#username");

// Get logged-in user
let loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  window.location.replace("./index.html");
} else {
  getUserInfo();
}

// Get user info and display username
async function getUserInfo() {
  try {
    const userDoc = await getDoc(doc(db, "users", loggedInUser));
    if (userDoc.exists()) {
      usernameDisplay.textContent = userDoc.data().username;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}

// Fetch and display all posts
async function getAllPosts() {
  try {
    allPostDiv.innerHTML = "";
    const posts = await getDocs(collection(db, "posts"));
    posts.forEach(async (post) => {
      let postData = post.data();
      
      // Get the author's name from Firestore
      let authorName = "Unknown";
      const userDoc = await getDoc(doc(db, "users", postData.uid));
      if (userDoc.exists()) {
        authorName = userDoc.data().username;
      }

      let postTime = postData.timestamp?.toDate().toLocaleString() || "Just now";

      allPostDiv.innerHTML += `
        <div class="post-box">
          <div class="post-header">${authorName}</div>
          <div class="post-time">${postTime}</div>
          <div class="post-content">${postData.postText}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// Function to create a new post
async function createPost(text) {
  if (!text.trim()) {
    alert("Post cannot be empty!");
    return;
  }

  try {
    await addDoc(collection(db, "posts"), {
      postText: text,
      uid: loggedInUser,
      timestamp: serverTimestamp()
    });
    postInput.value = ""; // Clear input after adding
    getAllPosts(); // Refresh posts
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

// Event listener for adding a post
addPostBtn.addEventListener("click", () => {
  let postText = postInput.value;
  createPost(postText);
});

// Logout function
document.querySelector("#signOut").addEventListener("click", async () => {
  await signOut(auth)
    .then(() => {
      localStorage.removeItem("loggedInUser");
      window.location.replace("./index.html");
    })
    .catch((error) => {
      console.error("Error logging out:", error.message);
    });
});

// Load posts on page load
getAllPosts();
