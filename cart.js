import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const cartDiv = document.getElementById("cartItems");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    alert("Please Login");
    window.location.href = "login.html";
    return;
  }

  try {

    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "cart")
    );

    cartDiv.innerHTML = "";

    if (querySnapshot.empty) {
      cartDiv.innerHTML = "<h2>Your Cart is Empty 🛒</h2>";
      return;
    }

    querySnapshot.forEach((docSnap) => {

      const product = docSnap.data();

      cartDiv.innerHTML += `
        <div class="card">
          <img src="${product.image}" alt="${product.productName}">
          <div class="card-content">
            <h2>${product.productName}</h2>
            <p class="price">₹${product.price}</p>
            <p>${product.description}</p>
            <button onclick="removeFromCart('${docSnap.id}')">
              Remove
            </button>
          </div>
        </div>
      `;

    });

  } catch (error) {
    console.log(error);
    alert(error.message);
  }

});

window.removeFromCart = async function(id) {

  const user = auth.currentUser;

  if (!user) {
    alert("Please Login");
    return;
  }

  try {

    await deleteDoc(
      doc(db, "users", user.uid, "cart", id)
    );

    alert("Removed Successfully ✅");
    location.reload();

  } catch (error) {
    console.log(error);
    alert(error.message);
  }

};
