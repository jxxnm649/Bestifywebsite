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

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

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
          <div class="card" style="margin-top:20px;">
            <img src="${product.image}" style="width:100%;height:220px;object-fit:cover;">

            <div class="card-content">
              <h2>${product.productName}</h2>
              <p class="price">₹${product.price}</p>
              <p>${product.description}</p>
            <button onclick="window.location.href='invoice.html?id=${docSnap.id}'">
📄 View Invoice
</button>
            </div>
          </div>
        `;

      });

      ordersDiv.innerHTML += `

        <div class="card" style="padding:20px;margin-bottom:30px;">

          <h2>${order.customerName}</h2>

          <p><b>Mobile:</b> ${order.mobile}</p>

          <p><b>Address:</b> ${order.address}</p>

          <p><b>Total:</b> ₹${order.total}</p>
    <button onclick="window.location.href='invoice.html?id=${docSnap.id}'">
📄 View Invoice
</button>
          <p>
            <b>Status:</b>
            <span style="color:orange;font-weight:bold;">
              ${order.status}
            </span>
          </p>
          <button onclick="window.location.href='invoice.html?id=${docSnap.id}'">
📄 View Invoice
</button>

          ${productsHTML}

        </div>

      `;

    });

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

});
