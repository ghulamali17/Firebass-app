import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let myPostDiv = document.querySelector("#myPosts");
let allPostDiv = document.querySelector("#allPosts");
let loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
  window.location.replace("./index.html");
}

// Fetch and display all posts
let getAllPosts = async () => {
  allPostDiv.innerHTML = "";
  try {
    const posts = await getDocs(collection(db, "posts"));
    posts.forEach((post) => {
      allPostDiv.innerHTML += `<div class='box'>${post.data().postText}</div>`;
    });
  } catch (error) {
    console.error(error);
  }
};

// Fetch and display only logged-in user's posts
let getMyPosts = async () => {
  myPostDiv.innerHTML = "";
  try {
    const q = query(collection(db, "posts"), where("uid", "==", loggedInUser));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((post) => {
      myPostDiv.innerHTML += `<div class='box'>${post.data().postText}</div>`;
    });
  } catch (error) {
    console.error(error);
  }
};

// Create a new post
let createPost = async (text) => {
  try {
    await addDoc(collection(db, "posts"), {
      postText: text,
      uid: loggedInUser,
    });
    getAllPosts();
    getMyPosts();
  } catch (error) {
    console.error(error);
  }
};

document.querySelector("#add").addEventListener("click", () => {
  let postTxt = document.querySelector("#post-inp").value;
  createPost(postTxt);
});

// Fetch all posts and my posts on button click
document.querySelector("#allPosts-btn").addEventListener("click", getAllPosts);
document.querySelector("#myPosts-btn").addEventListener("click", getMyPosts);

// Sign out function
document.querySelector("#signOut").addEventListener("click", async () => {
  await signOut(auth).then(() => {
    localStorage.removeItem("loggedInUser");
    window.location.replace("./index.html");
  }).catch((error) => {
    console.error(error.message);
  });
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  getAllPosts();
  getMyPosts();
});
