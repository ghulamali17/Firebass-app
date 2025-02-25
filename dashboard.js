import {
  addDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let allPostDiv = document.querySelector("#allPosts");
let postInput = document.querySelector("#post-inp");
let addPostBtn = document.querySelector("#add-post");

let loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  window.location.replace("./index.html");
}

// Function to get all posts
let getAllPosts = async () => {
  try {
    allPostDiv.innerHTML = "";
    const posts = await getDocs(collection(db, "posts"));
    posts.forEach((post) => {
      allPostDiv.innerHTML += <div class="post-box">${post.data().postText}</div>;
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// Function to create a new post
let createPost = async (text) => {
  if (!text.trim()) {
    alert("Post cannot be empty!");
    return;
  }

  try {
    await addDoc(collection(db, "posts"), {
      postText: text,
      uid: loggedInUser,
    });
    postInput.value = ""; // Clear input after adding
    getAllPosts(); // Refresh posts
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

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
