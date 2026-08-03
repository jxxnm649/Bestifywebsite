import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const form = document.getElementById("checkoutForm");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

});

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const customerName =
    document.getElementById("customerName").value;

  const mobile =
    document.getElementById("mobile").value;

  const address =
    document.getElementById("address").value;

  const params = new URLSearchParams(window.location.search);

  const buyNowProductId =
    params.get("productId");

  let products = [];

  let cartSnapshot = null;

  try {

    if (buyNowProductId) {

      const productSnap = await getDoc(
        doc(db, "products", buyNowProductId)
      );

      const total = products.reduce(
    (sum, item) => sum + Number(item.price),
    0
);

await addDoc(collection(db, "orders"), {
    userId: currentUser.uid,
    customerName,
    mobile,
    address,
    products,
    total: total,
    status: "Pending",
    createdAt: new Date()
});
      
      if (!productSnap.exists()) {

        alert("Product Not Found");

        return;

      }

      products.push(productSnap.data());

    } else {

      cartSnapshot = await getDocs(

        collection(
          db,
          "users",
          currentUser.uid,
          "cart"
        )

      );

      if (cartSnapshot.empty) {

        alert("Your Cart is Empty");

        return;

      }

      cartSnapshot.forEach((docSnap) => {

        products.push(docSnap.data());

      });

    }

    const totalAmount =
      products.reduce(
        (sum, item) =>
          sum + Number(item.price),
        0
      );
        const options = {

      key: "rzp_test_TL1OXROVimUJpK",

      amount: totalAmount * 100,

      currency: "INR",

      name: "Bestify Store",

      description: "Product Purchase",

      handler: async function (response) {

        await addDoc(
          collection(db, "orders"),
          {
            userId: currentUser.uid,
            customerName,
            mobile,
            address,
            products,
            total: totalAmount,
            paymentId: response.razorpay_payment_id,
            status: "Paid",
            createdAt: new Date()
          }
        );

        if (!buyNowProductId && cartSnapshot) {

          for (const cartDoc of cartSnapshot.docs) {

            await deleteDoc(
              doc(
                db,
                "users",
                currentUser.uid,
                "cart",
                cartDoc.id
              )
            );

          }

        }

        alert("Payment Successful ✅");

        window.location.href = "orders.html";

      },

      theme: {
        color: "#3399cc"
      }

    };

    const rzp = new Razorpay(options);

    rzp.open();
      } catch (error) {

    console.log(error);

    alert(error.message);

  }

});
