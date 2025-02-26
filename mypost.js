import { 
  collection, getDocs, query, where, 
  deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let myPostDiv = document.querySelector("#myPosts");

// Get logged-in user
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  window.location.replace("./index.html");
}

// Fetch and display user's posts
let getMyPosts = async () => {
  try {
    myPostDiv.innerHTML = "";
    const q = query(collection(db, "posts"), where("uid", "==", loggedInUser.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((post) => {
      let postData = post.data();
      let postId = post.id; 

      myPostDiv.innerHTML += `
        <div class="post-box" id="post-${postId}">
          <p id="text-${postId}">${postData.postText}</p>
          <button onclick="editPost('${postId}', '${postData.postText}')">Edit</button>
          <button onclick="deletePost('${postId}')">Delete</button>
        </div>`;
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
};

// Edit Post
window.editPost = async (postId, oldText) => {
  let newText = prompt("Edit your post:", oldText);
  if (newText === null || newText.trim() === "") return;

  try {
    await updateDoc(doc(db, "posts", postId), {
      postText: newText
    });

    document.getElementById(`text-${postId}`).innerText = newText;
    alert("✅ Post updated successfully!");
  } catch (error) {
    console.error("Error updating post:", error);
    alert("❌ Error updating post. Try again!");
  }
};

// Delete Post
window.deletePost = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await deleteDoc(doc(db, "posts", postId));
    document.getElementById(`post-${postId}`).remove();
    alert("✅ Post deleted successfully!");
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("❌ Error deleting post. Try again!");
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

// Load user posts
getMyPosts();
