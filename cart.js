import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const cartDiv = document.getElementById("cartItems");

alert("Cart JS Loaded");

onAuthStateChanged(auth, async (user) => {

  alert("Auth State Changed");

  if (!user) {
    alert("Please Login");
    window.location.href = "login.html";
    return;
  }

  alert(user.email);

  try {

    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "cart")
    );

    alert("Cart Products: " + querySnapshot.size);

    cartDiv.innerHTML = "";

    querySnapshot.forEach((doc) => {

      const product = doc.data();

      cartDiv.innerHTML += `
        <div class="card">

          <img src="${product.image}" alt="${product.productName}">

          <div class="card-content">

            <h2>${product.productName}</h2>

            <p>₹${product.price}</p>

            <p>${product.description}</p>

          </div>

        </div>
      `;

    });

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

});
