import { 
  addDoc, collection, getDocs 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let allPostDiv = document.querySelector("#allPosts");
let postInput = document.querySelector("#post-inp");
let addPostBtn = document.querySelector("#add-post");

// user is logged in
let loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  window.location.replace("./index.html");
}

//  Display All Posts
let getAllPosts = async () => {
  try {
    allPostDiv.innerHTML = "";
    const posts = await getDocs(collection(db, "posts"));
    posts.forEach((post) => {
      let postData = post.data();
      allPostDiv.innerHTML += `
        <div class="post-box">
          <p>${postData.postText}</p>
        </div>`;
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// Create a New Post
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
    postInput.value = ""; 
    getAllPosts(); 
  } catch (error) {
    console.error("Error creating post:", error);
  }
};


addPostBtn.addEventListener("click", () => {
  let postText = postInput.value;
  createPost(postText);
});

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

getAllPosts();
