import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const welcome = document.getElementById("welcome");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      welcome.innerHTML = `
        👋 Welcome <b>${data.name}</b>
      `;

    } else {

      welcome.innerHTML = `
        👋 Welcome ${user.email}
      `;

    }

  } catch (error) {

    console.log(error);

    welcome.innerHTML = `
      👋 Welcome ${user.email}
    `;

  }

});
import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { db } from "./firebase.js";

const productContainer=document.getElementById("productContainer");

async function loadProducts(){

const snapshot=await getDocs(collection(db,"products"));

snapshot.forEach((doc)=>{

const p=doc.data();

productContainer.innerHTML+=`

<div class="product-card">

<img src="${p.image}" alt="">

<div class="product-info">

<h3>${p.productName}</h3>

<p>${p.description}</p>

<div class="price">₹${p.price}</div>

<button class="buy-btn">
Buy Now
</button>

</div>

</div>

`;

});

}

loadProducts();
