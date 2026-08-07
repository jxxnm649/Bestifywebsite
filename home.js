import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const welcome = document.getElementById("welcome");
const productContainer = document.getElementById("productContainer");

// User Details
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      welcome.innerHTML = `👋 Welcome <b>${data.name}</b>`;

    } else {

      welcome.innerHTML = `👋 Welcome <b>${user.email}</b>`;

    }

  } catch (error) {

    console.log(error);

    welcome.innerHTML = `👋 Welcome <b>${user.email}</b>`;

  }

});

// Load Products
async function loadProducts() {

  try {

    const snapshot = await getDocs(collection(db, "products"));

    console.log("Products Found :", snapshot.size);

    productContainer.innerHTML = "";

    if (snapshot.empty) {

      productContainer.innerHTML = `
      <h3 style="text-align:center;color:red;">
      No Products Found
      </h3>
      `;

      return;
    }

    snapshot.forEach((doc) => {

      const p = doc.data();

      productContainer.innerHTML += `

      <div class="product-card">

        <img src="${p.image}" alt="${p.productName}">

        <div class="product-info">

          <h3>${p.productName}</h3>

          <p>${p.description}</p>

          <div class="price">₹${p.price}</div>

          <button class="buy-btn">
            Buy Now
          </button>

        </div>

      </div>

      `;

    });

  } catch (error) {

    console.log(error);

    alert("Error Loading Products");

  }

}

loadProducts();
