import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getdoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const ordersDiv = document.getElementById("orders");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    alert("User Not Found");
    window.location.href = "home.html";
    return;
  }

  if (userDoc.data().isAdmin !== true) {
    alert("Access Denied ❌");
    window.location.href = "home.html";
    return;
  }

  loadOrders();

});

async function loadOrders() {

  ordersDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "orders"));

  if (querySnapshot.empty) {
    ordersDiv.innerHTML = "<h2>No Orders Found</h2>";
    return;
  }

  querySnapshot.forEach((docSnap) => {

    const order = docSnap.data();

    ordersDiv.innerHTML += `
      <div class="card">

        <h2>${order.customerName}</h2>

        <p><b>Mobile:</b> ${order.mobile}</p>

        <p><b>Address:</b> ${order.address}</p>

        <p><b>Total:</b> ₹${order.total}</p>

        <p>
          <b>Status:</b>
          <span id="status-${docSnap.id}">
            ${order.status}
          </span>
        </p>

        <button onclick="updateStatus('${docSnap.id}','Confirmed')">
          Confirm
        </button>

        <button onclick="updateStatus('${docSnap.id}','Shipped')">
          Ship
        </button>

        <button onclick="updateStatus('${docSnap.id}','Delivered')">
          Deliver
        </button>

      </div>
    `;

  });

}

window.updateStatus = async function(id, status) {

  try {

    await updateDoc(doc(db, "orders", id), {
      status: status
    });

    alert("Status Updated ✅");

    loadOrders();

  } catch (error) {

    alert(error.message);

  }

};
