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

async function loadProducts() {

  try {

    const querySnapshot = await getDocs(collection(db, "products"));

    allProducts = [];

    querySnapshot.forEach((docSnap) => {

      const product = docSnap.data();

      allProducts.push({
        id: docSnap.id,
        ...product
      });

    });

    displayProducts(allProducts);

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

}

function displayProducts(products) {

  productsDiv.innerHTML = "";

  products.forEach((product) => {

    productsDiv.innerHTML += `
      <div class="card">

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

loadProducts();

searchInput.addEventListener("input", () => {

  const keyword = searchInput.value.toLowerCase();

  const filteredProducts = allProducts.filter(product =>
    product.productName.toLowerCase().includes(keyword) ||
    product.category.toLowerCase().includes(keyword)
  );

  displayProducts(filteredProducts);

});

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
