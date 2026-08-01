import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const ordersDiv = document.getElementById("orders");

alert("Orders JS Loaded");

onAuthStateChanged(auth, async (user) => {

  alert("Auth State Changed");

  if (!user) {
    alert("Please Login");
    window.location.href = "login.html";
    return;
  }

  alert("UID: " + user.uid);

  try {

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    alert("Orders Found: " + querySnapshot.size);

    ordersDiv.innerHTML = "";

    if (querySnapshot.empty) {
      ordersDiv.innerHTML = "<h2>No Orders Found 📦</h2>";
      return;
    }

    querySnapshot.forEach((docSnap) => {

      const order = docSnap.data();

      let productsHTML = "";

      order.products.forEach((product) => {

        productsHTML += `
          <div class="card" style="margin-bottom:20px;">
            <img src="${product.image}" style="width:100%;height:220px;object-fit:cover;">

            <div class="card-content">
              <h2>${product.productName}</h2>
              <p class="price">₹${product.price}</p>
              <p>${product.description}</p>
            </div>

          </div>
        `;

      });

      ordersDiv.innerHTML += `
        <h2>${order.customerName}</h2>
        <p><b>Mobile:</b> ${order.mobile}</p>
        <p><b>Address:</b> ${order.address}</p>

        ${productsHTML}

        <hr>
      `;

    });

    <p><b>Total:</b> ₹${order.total}</p>

<p>
  <b>Status:</b>
  <span style="color:orange;font-weight:bold;">
    ${order.status}
  </span>
</p>
  } catch (error) {

    alert(error.message);
    console.log(error);

  }

});
