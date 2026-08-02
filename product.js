import { auth, db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const productDiv = document.getElementById("product");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

loadProduct();

async function loadProduct() {

  try {

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      productDiv.innerHTML = "<h2>Product Not Found</h2>";
      return;
    }

    const product = productSnap.data();

    productDiv.innerHTML = `
      <div class="card">

        <img src="${product.image}" alt="${product.productName}">

        <div class="card-content">

          <h1>${product.productName}</h1>

          <p><b>Category:</b> ${product.category}</p>

          <p class="price">₹${product.price}</p>

          <p>${product.description}</p>

          <button onclick="addToCart()">
            Add To Cart
          </button>

        </div>

      </div>
    `;

  } catch (error) {

    alert(error.message);

  }

}

window.addToCart = async function() {

  const user = auth.currentUser;

  if (!user) {
    alert("Please Login First");
    return;
  }

  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);

  await setDoc(
    doc(db, "users", user.uid, "cart", productId),
    productSnap.data()
  );

  alert("Added To Cart ✅");

};
