import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let myPostDiv = document.querySelector("#myPosts");

let loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  window.location.replace("./index.html");
}

let getMyPosts = async () => {
  try {
    myPostDiv.innerHTML = "";
    const q = query(collection(db, "posts"), where("uid", "==", loggedInUser));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((post) => {
      myPostDiv.innerHTML += <div class="post-box">${post.data().postText}</div>;
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

getMyPosts();
