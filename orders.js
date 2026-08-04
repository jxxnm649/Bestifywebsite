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
  <p>

<b>Status:</b>

<span
style="
background:${statusColor};
color:white;
padding:6px 12px;
border-radius:20px;
font-weight:bold;
">

${statusIcon} ${order.status}

</span>

</p>

          let statusColor = "#ff9800";
let statusIcon = "🟡";

if(order.status==="Confirmed"){
statusColor="#2196F3";
statusIcon="🟢";
}

if(order.status==="Packed"){
statusColor="#9C27B0";
statusIcon="📦";
}

if(order.status==="Shipped"){
statusColor="#3F51B5";
statusIcon="🚚";
}

if(order.status==="Out for Delivery"){
statusColor="#009688";
statusIcon="🚛";
}

if(order.status==="Delivered"){
statusColor="#4CAF50";
statusIcon="✅";
}

if(order.status==="Cancelled"){
statusColor="#F44336";
statusIcon="❌";
}

          ${productsHTML}

        </div>

      `;

    });

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

});
