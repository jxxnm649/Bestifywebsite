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
    alert("Please Login");
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

      let productList = "";

      order.products.forEach((product) => {
        productList += `
          <li>
            ${product.productName} - ₹${product.price}
          </li>
        `;
      });

      ordersDiv.innerHTML += `
        <div class="card">

          <div class="card-content">

            <h2>${order.customerName}</h2>

            <p><b>Mobile:</b> ${order.mobile}</p>

            <p><b>Address:</b> ${order.address}</p>

            <p><b>Total Products:</b> ${order.products.length}</p>

            <ul>
              ${productList}
            </ul>

          </div>

        </div>
      `;

    });

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

});
