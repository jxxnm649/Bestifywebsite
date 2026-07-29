import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
  doc,
  getDoc,
  setDoc
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
...
`;
      productsDiv.innerHTML 
<div class="card">

<img src="${product.image}">

<div class="card-content">

<h2>${product.productName}</h2>

<p>${product.category}</p>

<p class="price">₹${product.price}</p>

<p>${product.description}</p>

<button onclick="addToCart('${doc.id}')">Add to Cart</button>

</div>

</div>
`;
    });

  } catch (error) {
    alert(error.message);
  }
}

loadProducts();

window.addToCart = async function(id) {

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

  alert("Added To Cart ✅");
}
