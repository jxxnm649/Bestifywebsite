let allProducts = [];
import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("search");

async function loadProducts() {
  try {

    const querySnapshot = await getDocs(collection(db, "products"));

    productsDiv.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
    
      const product = docSnap.data();
  const product = doc.data();
      allProducts.push({
  id: doc.id,
  ...product
});
      
      productsDiv.innerHTML += `
        <div class="card">

          <img src="${product.image}" alt="${product.productName}">

          <div class="card-content">

            <h2>${product.productName}</h2>

            <p>${product.category}</p>

            <p class="price">₹${product.price}</p>

            <p>${product.description}</p>

            <button onclick="addToCart('${docSnap.id}')">
              Add to Cart
            </button>

          </div>

        </div>
      `;

    });

  } catch (error) {
    alert(error.message);
    console.log(error);
  }
}

loadProducts();
searchInput.addEventListener("input", () => {

  const keyword = searchInput.value.toLowerCase();

  productsDiv.innerHTML = "";

  allProducts
    .filter(product =>
      product.productName.toLowerCase().includes(keyword)
    )
    .forEach(product => {

      productsDiv.innerHTML += `
      <div class="card">

        <img src="${product.image}">

        <div class="card-content">

          <h2>${product.productName}</h2>

          <p>${product.category}</p>

          <p class="price">₹${product.price}</p>

          <p>${product.description}</p>

          <button onclick="addToCart('${product.id}')">
            Add To Cart
          </button>

        </div>

      </div>
      `;

    });

});

window.addToCart = async function(id) {

  alert("Adding Product ID: " + id);

  const user = auth.currentUser;

  if (!user) {
    alert("Please Login First");
    return;
  }

  const productRef = doc(db, "products", id);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    alert("Product Not Found");
    return;
  }

  const product = productSnap.data();

  await setDoc(
    doc(db, "users", user.uid, "cart", id),
    product
  );

  alert("Saved to Firestore ✅");
  alert("Added To Cart ✅");
};
