import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let allPostDiv = document.querySelector("#allPosts");

let loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  window.location.replace("./index.html");
}

let getAllPosts = async () => {
  try {
    allPostDiv.innerHTML = "";
    const posts = await getDocs(collection(db, "posts"));
    posts.forEach((post) => {
      allPostDiv.innerHTML += `<div class="post-box">${post.data().postText}</div>`;
    });
  } catch (error) {
    console.error(error);
  }
};

document.querySelector("#signOut").addEventListener("click", async () => {
  await signOut(auth)
    .then(() => {
      localStorage.removeItem("loggedInUser");
      window.location.replace("./index.html");
    })
    .catch((error) => {
      console.error(error.message);
    });
});

getAllPosts();
