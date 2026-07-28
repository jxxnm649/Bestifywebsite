import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const productsDiv = document.getElementById("products");
alert(querySnapshot.size);
async function loadProducts(console.log(querySnapshot.size);) {

    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc) => {

        const product = doc.data();

        productsDiv.innerHTML += `
            <div style="border:1px solid #ccc;padding:15px;margin:10px;">
                <h2>${product.productName}</h2>
                <p>₹${product.price}</p>
                <p>${product.description}</p>
            </div>
        `;

    });

}

loadProducts();
