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

switch(order.status){

case "Pending":
confirmed = "current";
break;

case "Confirmed":
confirmed = "active";
break;

case "Packed":
confirmed = "active";
packed = "active";
break;

case "Shipped":
confirmed = "active";
packed = "active";
shipped = "active";
break;

case "Out for Delivery":
confirmed = "active";
packed = "active";
shipped = "active";
delivery = "current";
break;

case "Delivered":
confirmed = "active";
packed = "active";
shipped = "active";
delivery = "active";
delivered = "active";
break;

}
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
<div class="tracking">

<div class="${["Pending","Confirmed","Packed","Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}">
🟡 Pending
</div>

<div class="${["Confirmed","Packed","Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}">
🟢 Confirmed
</div>

<div class="${["Packed","Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}">
📦 Packed
</div>

<div class="${["Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}">
🚚 Shipped
</div>

<div class="${["Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}">
🚛 Out for Delivery
</div>

<div class="${order.status==="Delivered" ? "active" : ""}">
✅ Delivered
</div>

</div>
<span>
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
          ${productsHTML}

        </div>

      `;

    });

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

});
