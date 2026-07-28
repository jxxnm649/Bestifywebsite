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

        await addDoc(collection(db, "products"), {
            productName: productName,
            price: Number(price),
            description: description
        });

        alert("Product Added Successfully!");

        form.reset();

    } catch (error) {
        alert(error.message);
    }
});