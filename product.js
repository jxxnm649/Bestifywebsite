import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const productDiv = document.getElementById("product");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

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

    <button onclick="buyNow()">
      Buy Now
    </button>

  </div>

</div>
`;

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

}

window.addToCart = async function () {

  if (!currentUser) {
    alert("Please Login First");
    window.location.href = "login.html";
    return;
  }

  try {

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      alert("Product Not Found");
      return;
    }

    await setDoc(
      doc(db, "users", currentUser.uid, "cart", productId),
      productSnap.data()
    );

    alert("Added To Cart ✅");

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

};

window.buyNow = function () {

  window.location.href = `checkout.html?productId=${productId}`;

};
