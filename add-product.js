import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const form = document.getElementById("productForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const productName = document.getElementById("productName").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;

    try {

        await setDoc(doc(db,"products",Date.now().toString()),{

 productName: productName,
 price: price,
 description: description,
 image: document.getElementById("image").value,
 category: document.getElementById("category").value,
 createdAt:new Date()

});

        alert("Product Added Successfully!");

        form.reset();

    } catch (error) {
        alert(error.message);
    }
});
