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
      ordersDiv.innerHTML = "<h2 style='text-align:center; margin-top:50px;'>No Orders Found 📦</h2>";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const order = docSnap.data();

      // Step Active / Completed Class Variables
      let c1 = "", c2 = "", c3 = "", c4 = "";
      let progressWidth = "0%";
      let statusColor = "#038d63";
      let statusIcon = "🟢";

      // Meesho Horizontal Status Logic
      switch (order.status) {
        case "Pending":
        case "Confirmed":
        case "Ordered":
          c1 = "completed";
          progressWidth = "0%";
          statusColor = "#2196F3";
          statusIcon = "🟢";
          break;

        case "Packed":
          c1 = "completed";
          c2 = "completed";
          progressWidth = "33%";
          statusColor = "#9C27B0";
          statusIcon = "📦";
          break;

        case "Shipped":
          c1 = "completed";
          c2 = "completed";
          c3 = "completed";
          progressWidth = "66%";
          statusColor = "#3F51B5";
          statusIcon = "🚚";
          break;

        case "Out for Delivery":
        case "Delivered":
          c1 = "completed";
          c2 = "completed";
          c3 = "completed";
          c4 = "completed";
          progressWidth = "100%";
          statusColor = "#038d63";
          statusIcon = "✅";
          break;

        default:
          c1 = "completed";
          progressWidth = "0%";
      }

      // Products HTML Generation
      let productsHTML = "";

      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product) => {
          productsHTML += `
            <div class="card" style="margin-top:20px; border:1px solid #eee; padding:15px; border-radius:10px;">
              <img src="${product.image}" style="width:100%; height:220px; object-fit:cover; border-radius:8px;">
              <div class="card-content" style="margin-top:10px;">
                <h2 style="font-size:18px; margin-bottom:5px;">${product.productName}</h2>
                <p class="price" style="font-size:16px; font-weight:bold; color:#333;">₹${product.price}</p>
                <p style="color:#666; font-size:14px;">${product.description || ''}</p>
                <button onclick="window.location.href='invoice.html?id=${docSnap.id}'" style="margin-top:10px; background:#f0f0f0; border:none; padding:8px 15px; border-radius:6px; cursor:pointer;">
                  📄 View Invoice
                </button>
              </div>
            </div>
          `;
        });
      }

      // Main Card Dynamic HTML Render
      ordersDiv.innerHTML += `
        <div class="card" style="padding:20px; margin-bottom:30px; background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <h2 style="margin-bottom:10px; font-size:20px;">${order.customerName}</h2>
          <p><b>Mobile:</b> ${order.mobile}</p>
          <p><b>Address:</b> ${order.address}</p>
          <p><b>Total:</b> ₹${order.total}</p>

          <p style="margin-top:10px;">
            <b>Status:</b>
            <span style="background:${statusColor}; color:white; padding:4px 12px; border-radius:15px; font-weight:bold; font-size:13px; display:inline-block; margin-left:5px;">
              ${statusIcon} ${order.status}
            </span>
          </p>

          <!-- Meesho Style Progress Bar Tracker -->
          <div class="status-tracker">
            <div class="progress-bar">
              <div class="progress-line" style="width: ${progressWidth};"></div>
              
              <div class="step ${c1}">
                <div class="circle"><i class="fa-solid fa-check"></i></div>
                <span>Ordered</span>
              </div>
              
              <div class="step ${c2}">
                <div class="circle"><i class="fa-solid fa-box"></i></div>
                <span>Packed</span>
              </div>

              <div class="step ${c3}">
                <div class="circle"><i class="fa-solid fa-truck"></i></div>
                <span>Shipped</span>
              </div>

              <div class="step ${c4}">
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
