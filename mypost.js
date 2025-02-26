import { 
  collection, getDocs, query, where, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let myPostDiv = document.querySelector("#myPosts");

// Check if user is logged in
let loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  window.location.replace("./index.html");
}

// Display User's Posts
let getMyPosts = async () => {
  try {
    myPostDiv.innerHTML = "<p>Loading posts...</p>";

    const q = query(collection(db, "posts"), where("uid", "==", loggedInUser));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      myPostDiv.innerHTML = "<p>No posts found.</p>";
      return;
    }

    myPostDiv.innerHTML = ""; 
    querySnapshot.forEach((postDoc) => {
      let postData = postDoc.data();
      let postId = postDoc.id; 

      myPostDiv.innerHTML += `
        <div class="post-box" id="post-${postId}">
          <p id="post-text-${postId}">${postData.postText}</p>
          <button onclick="editPost('${postId}', '${postData.postText.replace(/'/g, "\\'")}')">Edit</button>
          <button onclick="deletePost('${postId}')">Delete</button>
        </div>`;
    });
  } catch (error) {
    console.error("🔥 Error fetching user posts:", error);
    myPostDiv.innerHTML = "<p>Error loading posts. Check console.</p>";
  }
};

// Edit Post Function
window.editPost = async (postId, oldText) => {
  let newText = prompt("Edit your post:", oldText);
  if (newText && newText !== oldText) {
    try {
      let postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { postText: newText });
      document.querySelector(`#post-text-${postId}`).textContent = newText;
      alert("✅ Post updated successfully!");
    } catch (error) {
      console.error("❌ Error updating post:", error);
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
      document.querySelector(`#post-${postId}`).remove();
      alert("🗑️ Post deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting post:", error);
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
    console.error("❌ Logout error:", error);
  }
});

// Load Posts
getMyPosts();
