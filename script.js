import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { doc, setDoc }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

await setDoc(doc(db, "test", "abc123"), {
    name: document.getElementById("name").value,
    email: email,
    createdAt: new Date()
});

alert("Registration Successful!");

    } catch (error) {
        alert(error.message);
    }
});
