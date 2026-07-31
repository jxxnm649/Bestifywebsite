import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
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

  <img src="${product.image}">

  <div class="card-content">

    <h2>${product.productName}</h2>

    <p class="price">₹${product.price}</p>

    <p>${product.description}</p>

    <button onclick="removeFromCart('${doc.id}')">
      Remove
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

window.removeFromCart = async function(id) {

  const user = auth.currentUser;

  await deleteDoc(
    doc(db, "users", user.uid, "cart", id)
  );

  alert("Product Removed ✅");

  location.reload();

};
