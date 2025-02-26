import { 
  collection, getDocs, query, where 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let myPostDiv = document.querySelector("#myPosts");

// user is logged in
let loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  window.location.replace("./index.html");
}

// Display User's Posts
let getMyPosts = async () => {
  try {
    myPostDiv.innerHTML = "";
    const q = query(collection(db, "posts"), where("uid", "==", loggedInUser));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((post) => {
      let postData = post.data();
      myPostDiv.innerHTML += `
        <div class="post-box">
          <p>${postData.postText}</p>
        </div>`;
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
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


getMyPosts();
