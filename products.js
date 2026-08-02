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

let allProducts = [];

// Load Products
async function loadProducts() {

  try {

    const querySnapshot = await getDocs(collection(db, "products"));

    allProducts = [];

    querySnapshot.forEach((docSnap) => {

      allProducts.push({
        id: docSnap.id,
        ...docSnap.data()
      });

    });

    displayProducts(allProducts);

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

}

// Display Products
function displayProducts(products) {

  productsDiv.innerHTML = "";

  if (products.length === 0) {
    productsDiv.innerHTML = "<h2>No Products Found 😔</h2>";
    return;
  }

  products.forEach((product) => {

    productsDiv.innerHTML += `
      <div class="card" onclick="openProduct('${product.id}')">

        <img src="${product.image}" alt="${product.productName}">

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

}

// Search
searchInput.addEventListener("keyup", () => {

  const keyword = searchInput.value.trim().toLowerCase();

  const filteredProducts = allProducts.filter(product => {

    const name = (product.productName || "").toLowerCase();
    const category = (product.category || "").toLowerCase();
    const description = (product.description || "").toLowerCase();

    return (
      name.includes(keyword) ||
      category.includes(keyword) ||
      description.includes(keyword)
    );

  });

  displayProducts(filteredProducts);

});

// Add To Cart
window.addToCart = async function(id) {

  try {

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

    await setDoc(
      doc(db, "users", user.uid, "cart", id),
      productSnap.data()
    );

    alert("Added To Cart ✅");

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

};
window.openProduct = function(id) {
  window.location.href = "product.html?id=" + id;
};

// Start
loadProducts();

