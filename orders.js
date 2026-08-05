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

// Auth State Monitor
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
      ordersDiv.innerHTML = `
        <div style="text-align:center; padding:50px; background:#fff; border-radius:8px;">
          <h2>No Orders Found 📦</h2>
          <p style="color:#666; margin-top:10px;">Looking like you haven't placed an order yet.</p>
        </div>`;
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const order = docSnap.data();

      // Tracker Step Active Logic
      let step1 = "", step2 = "", step3 = "", step4 = "";
      let progressWidth = "0%";

      switch (order.status) {
        case "Confirmed":
        case "Ordered":
        case "Pending":
          step1 = "active";
          progressWidth = "0%";
          break;

        case "Packed":
          step1 = "active";
          step2 = "active";
          progressWidth = "33%";
          break;

        case "Shipped":
          step1 = "active";
          step2 = "active";
          step3 = "active";
          progressWidth = "66%";
          break;

        case "Out for Delivery":
        case "Delivered":
          step1 = "active";
          step2 = "active";
          step3 = "active";
          step4 = "active";
          progressWidth = "100%";
          break;

        default:
          step1 = "active";
          progressWidth = "0%";
      }

      // Generate Product Cards HTML
      let productsHTML = "";
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product) => {
          productsHTML += `
            <div class="product-item" style="display:flex; gap:15px; margin-top:15px; border-top:1px solid #eee; padding-top:15px;">
              <img src="${product.image}" alt="${product.productName}" style="width:90px; height:90px; object-fit:cover; border-radius:8px; border:1px solid #ddd;">
              <div class="product-details">
                <h3 style="font-size:16px; margin-bottom:5px; color:#333;">${product.productName}</h3>
                <p class="price" style="font-weight:bold; color:#b12704; font-size:15px;">₹${product.price}</p>
                <p style="font-size:13px; color:#666; margin-top:4px;">${product.description || ''}</p>
              </div>
            </div>
          `;
        });
      }

      // Safe Total Calculation (Fixes Total: ₹undefined)
      const orderTotal = order.total !== undefined ? order.total : (order.totalPrice !== undefined ? order.totalPrice : 0);

      // Render Clean Card UI
      ordersDiv.innerHTML += `
        <div class="order-card" style="background:#fff; border-radius:12px; padding:20px; margin-bottom:25px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <h2 style="font-size:20px; margin-bottom:10px;">${order.customerName || 'Customer'}</h2>
          <p><b>Mobile:</b> ${order.mobile || ''}</p>
          <p><b>Address:</b> ${order.address || ''}</p>
          <p><b>Total:</b> ₹${orderTotal}</p>

          <!-- Status Header with Clean Green Badge (No Symbols) -->
          <div style="display: flex; align-items: center; gap: 8px; margin: 12px 0;">
            <b style="font-size: 15px;">Status:</b>
            <span style="background: #038d63; color: white; padding: 4px 14px; border-radius: 15px; font-weight: bold; font-size: 13px;">
              ${order.status}
            </span>
          </div>

          <!-- Amazon / Meesho Horizontal Tracking Bar -->
          <div class="status-tracker" style="margin: 20px 0;">
            <div class="progress-bar">
              <div class="progress-line" style="width: ${progressWidth};"></div>

              <div class="step ${step1}">
                <div class="circle"><i class="fa-solid fa-check"></i></div>
                <span>Ordered</span>
              </div>

              <div class="step ${step2}">
                <div class="circle"><i class="fa-solid fa-box"></i></div>
                <span>Packed</span>
              </div>

              <div class="step ${step3}">
                <div class="circle"><i class="fa-solid fa-truck"></i></div>
                <span>Shipped</span>
              </div>

              <div class="step ${step4}">
                <div class="circle"><i class="fa-solid fa-house"></i></div>
                <span>Delivered</span>
              </div>
            </div>
          </div>

          <!-- Products Render -->
          ${productsHTML}
        </div>
      `;
    });

  } catch (error) {
    console.error("Orders Fetch Error: ", error);
    alert("Error fetching orders: " + error.message);
  }
});
