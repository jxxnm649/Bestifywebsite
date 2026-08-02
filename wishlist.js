import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const wishlistDiv = document.getElementById("wishlistItems");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "wishlist")
    );

    wishlistDiv.innerHTML = "";

    if (querySnapshot.empty) {
      wishlistDiv.innerHTML = "<h2>Your Wishlist is Empty ❤️</h2>";
      return;
    }

    querySnapshot.forEach((docSnap) => {

      const product = docSnap.data();

      wishlistDiv.innerHTML += `
        <div class="card">

          <img src="${product.image}" alt="${product.productName}">

          <div class="card-content">

            <h2>${product.productName}</h2>

            <p>${product.category}</p>

            <p class="price">₹${product.price}</p>

            <p>${product.description}</p>

            <button onclick="removeWishlist('${docSnap.id}')">
              Remove ❤️
            </button>

          </div>

        </div>
      `;

    });

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

});

window.removeWishlist = async function(id) {

  const user = auth.currentUser;

  if (!user) {
    alert("Please Login First");
    return;
  }

  try {

    await deleteDoc(
      doc(db, "users", user.uid, "wishlist", id)
    );

    alert("Removed from Wishlist ❤️");

    location.reload();

  } catch (error) {

    alert(error.message);

  }

};
