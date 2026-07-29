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
  <div style="border:1px solid #ccc;padding:15px;margin:10px;">
    <img src="https://i.ibb.co/kVf72jbJ/20260725-180831.jpg" width="200">
    <h2>${product.productName}</h2>
    <p>₹${product.price}</p>
    <p>${product.description}</p>
  </div>
`;
    });

  } catch (error) {
    alert(error.message);
  }
}

loadProducts();
