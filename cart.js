alert("Cart JS Loaded");
alert(querySnapshot.size);
import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs
}
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const cartDiv = document.getElementById("cartItems");

onAuthStateChanged(auth, async (user) => {

  alert("Auth State Changed");

  if (!user) {
    alert("Please Login");
    return;
  }

  alert(user.email);

  const querySnapshot = await getDocs(
    collection(db, "users", user.uid, "cart")
  );

  alert("Cart Products: " + querySnapshot.size);

  querySnapshot.forEach((doc) => {
    const product = doc.data();

    cartDiv.innerHTML += `
      <div class="card">
        <img src="${product.image}">
        <div class="card-content">
          <h2>${product.productName}</h2>
          <p>₹${product.price}</p>
          <p>${product.description}</p>
        </div>
      </div>
    `;
  });

});

});
