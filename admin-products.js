import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const form = document.getElementById("productForm");
const productsDiv = document.getElementById("products");

// Check Admin
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists() || userDoc.data().isAdmin !== true) {
    alert("Access Denied ❌");
    window.location.href = "home.html";
    return;
  }

  loadProducts();
 <div class="card-content">

  <h3>${product.productName}</h3>

  <p>${product.category}</p>

  <p class="price">₹${product.price}</p>

  <p>${product.description}</p>

</div>
});

// Save Product
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    await addDoc(collection(db, "products"), {

      image: document.getElementById("image").value,
      productName: document.getElementById("productName").value,
      category: document.getElementById("category").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value

    });

    alert("Product Added Successfully ✅");

    form.reset();

    loadProducts();

  } catch (error) {

    alert(error.message);

  }

});

// Load Products
async function loadProducts() {

  const querySnapshot = await getDocs(collection(db, "products"));

  productsDiv.innerHTML = "";

  querySnapshot.forEach((docSnap) => {

    const product = docSnap.data();

    productsDiv.innerHTML += `
      <div class="card">

        <img src="${product.image}" alt="${product.productName}">

        <div class="card-content">

          <h3>${product.productName}</h3>

          <p>${product.category}</p>

          <p class="price">₹${product.price}</p>

          <p>${product.description}</p>

        </div>

      </div>
    `;

  });

}
