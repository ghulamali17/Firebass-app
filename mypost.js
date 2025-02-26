import { 
  collection, getDocs, query, where, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let myPostDiv = document.querySelector("#myPosts");

// Check if user logged in
let loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  alert("You need to log in first!");
  window.location.replace("./index.html");
}

// Function to Display User's Posts
let getMyPosts = async () => {
  try {
    console.log("Fetching posts for UID:", loggedInUser);
    myPostDiv.innerHTML = "";

    //query user's posts
    const q = query(collection(db, "posts"), where("uid", "==", loggedInUser));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No posts found for this user.");
      myPostDiv.innerHTML = "<p>No posts available.</p>";
      return;
    }

    querySnapshot.forEach((post) => {
      let postData = post.data();
      let postId = post.id; 

      let postElement = document.createElement("div");
      postElement.classList.add("post-box");
      postElement.innerHTML = `
        <p id="post-text-${postId}">${postData.postText}</p>
        <button onclick="editPost('${postId}', '${postData.postText}')">Edit</button>
        <button onclick="deletePost('${postId}')">Delete</button>
      `;

      myPostDiv.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    alert("Failed to load posts. Check the console for more details.");
  }
};

// Edit Post Function
window.editPost = async (postId, oldText) => {
  let newText = prompt("Edit your post:", oldText);
  if (newText && newText !== oldText) {
    try {
      let postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { postText: newText });
      alert("Post updated successfully!");
      getMyPosts(); 
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  }
};

// Delete Post Function
window.deletePost = async (postId) => {
  let confirmDelete = confirm("Are you sure you want to delete this post?");
  if (confirmDelete) {
    try {
      let postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      alert("Post deleted successfully!");
      getMyPosts(); 
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  }
};

// Logout Function
document.querySelector("#signOut").addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("loggedInUser");
    window.location.replace("./index.html");
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// Load Posts
getMyPosts();
