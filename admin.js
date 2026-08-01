import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const ordersDiv = document.getElementById("orders");

alert("Admin JS Loaded");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    alert("Please Login");
    window.location.href = "login.html";
    return;
  }

  alert("UID: " + user.uid);

  try {

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      alert("User Document Not Found");
      return;
    }

    alert("isAdmin = " + userDoc.data().isAdmin);

    if (userDoc.data().isAdmin !== true) {
      alert("Access Denied ❌");
      window.location.href = "home.html";
      return;
    }

    loadOrders();

  } catch (error) {
    alert(error.message);
    console.log(error);
  }

});

async function loadOrders() {

  ordersDiv.innerHTML = "<h2>Loading...</h2>";

  try {

    const querySnapshot = await getDocs(collection(db, "orders"));

    if (querySnapshot.empty) {
      ordersDiv.innerHTML = "<h2>No Orders Found 📦</h2>";
      return;
    }

    ordersDiv.innerHTML = "";

    querySnapshot.forEach((docSnap) => {

      const order = docSnap.data();

      ordersDiv.innerHTML += `
      <div style="
        background:#fff;
        margin:15px;
        padding:15px;
        border-radius:10px;
        box-shadow:0 0 10px rgba(0,0,0,.15);
      ">

        <h2>${order.customerName}</h2>

        <p><b>Mobile:</b> ${order.mobile}</p>

        <p><b>Address:</b> ${order.address}</p>

        <p><b>Total:</b> ₹${order.total}</p>

        <p>
          <b>Status:</b>
          ${order.status}
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

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

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
