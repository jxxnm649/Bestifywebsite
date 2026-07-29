import { db } from "./firebase.js";

alert("products.js loaded");
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const productsDiv = document.getElementById("products");

async function loadProducts() {
  try {
    alert("JS Loaded");

    const querySnapshot = await getDocs(collection(db, "products"));
  console.log(querySnapshot.docs);
alert(querySnapshot.size);
    alert("Products: " + querySnapshot.size);

    querySnapshot.forEach((doc) => {
      const product = doc.data();

      productsDiv.innerHTML += `
<div class="card">

<img src="${product.image}">

<div class="card-content">

<h2>${product.productName}</h2>

<p>${product.category}</p>

<p class="price">₹${product.price}</p>

<p>${product.description}</p>

<button>Add to Cart</button>

</div>

</div>
`;
    });

  } catch (error) {
    alert(error.message);
  }
}

loadProducts();
