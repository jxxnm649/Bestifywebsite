import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  where
}
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const ordersDiv = document.getElementById("orders");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const q = query(
    collection(db, "orders"),
    where("userId", "==", user.uid)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    ordersDiv.innerHTML = "<h2>No Orders Found</h2>";
    return;
  }

  querySnapshot.forEach((docSnap) => {

    const order = docSnap.data();

    ordersDiv.innerHTML += `
      <div class="card">

        <div class="card-content">

          <h2>${order.customerName}</h2>

          <p>${order.mobile}</p>

          <p>${order.address}</p>

          <p><b>Products:</b> ${order.products.length}</p>

        </div>

      </div>
    `;

  });

});
