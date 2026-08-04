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

      let confirmed = "";
      let packed = "";
      let shipped = "";
      let delivery = "";
      let delivered = "";

      let statusColor = "#ff9800";
      let statusIcon = "⏳";

      switch (order.status) {
        case "Pending":
          confirmed = "current";
          statusColor = "#ff9800";
          statusIcon = "🟡";
          break;

        case "Confirmed":
          confirmed = "active";
          statusColor = "#2196F3";
          statusIcon = "🟢";
          break;

        case "Packed":
          confirmed = "active";
          packed = "active";
          statusColor = "#9C27B0";
          statusIcon = "📦";
          break;

        case "Shipped":
          confirmed = "active";
          packed = "active";
          shipped = "active";
          statusColor = "#3F51B5";
          statusIcon = "🚚";
          break;

        case "Out for Delivery":
          confirmed = "active";
          packed = "active";
          shipped = "active";
          delivery = "current";
          statusColor = "#E91E63";
          statusIcon = "🚛";
          break;

        case "Delivered":
          confirmed = "active";
          packed = "active";
          shipped = "active";
          delivery = "active";
          delivered = "active";
          statusColor = "#4CAF50";
          statusIcon = "✅";
          break;

        default:
          confirmed = "current";
      }

      let productsHTML = "";

      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product) => {
          productsHTML += `
            <div class="card" style="margin-top:20px;">
              <img src="${product.image}" style="width:100%;height:220px;object-fit:cover;">
              <div class="card-content">
                <h2>${product.productName}</h2>
                <p class="price">₹${product.price}</p>
                <p>${product.description || ''}</p>
                <button onclick="window.location.href='invoice.html?id=${docSnap.id}'">
                  📄 View Invoice
                </button>
              </div>
            </div>
          `;
        });
      }

      ordersDiv.innerHTML += `
        <div class="card" style="padding:20px;margin-bottom:30px;">
          <h2>${order.customerName}</h2>
          <p><b>Mobile:</b> ${order.mobile}</p>
          <p><b>Address:</b> ${order.address}</p>
          <p><b>Total:</b> ₹${order.total}</p>

          <p>
            <b>Status:</b>
            <span style="background:${statusColor};color:white;padding:6px 12px;border-radius:20px;font-weight:bold;display:inline-block;margin-left:8px;">
              ${statusIcon} ${order.status}
            </span>
          </p>

          <div class="status-tracker">
            <div class="progress-bar">
              <div class="step ${confirmed}">
                <div class="circle"><i class="fa-solid fa-circle-check"></i></div>
                <span>Confirmed</span>
              </div>
              <div class="step ${packed}">
                <div class="circle"><i class="fa-solid fa-box"></i></div>
                <span>Packed</span>
              </div>
              <div class="step ${shipped}">
                <div class="circle"><i class="fa-solid fa-truck"></i></div>
                <span>Shipped</span>
              </div>
              <div class="step ${delivery}">
                <div class="circle"><i class="fa-solid fa-motorcycle"></i></div>
                <span>Out for Delivery</span>
              </div>
              <div class="step ${delivered}">
                <div class="circle"><i class="fa-solid fa-house"></i></div>
                <span>Delivered</span>
              </div>
            </div>
          </div>

          ${productsHTML}
        </div>
      `;
    });

  } catch (error) {
    alert(error.message);
    console.log(error);
  }
});

