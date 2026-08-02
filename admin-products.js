import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const form = document.getElementById("productForm");
const productsDiv = document.getElementById("products");
const imageFile = document.getElementById("imageFile");
const preview = document.getElementById("preview");
imageFile.addEventListener("change", () => {

  const file = imageFile.files[0];

  if (!file) return;

  preview.src = URL.createObjectURL(file);

  preview.style.display = "block";

});
let editMode = false;
let editProductId = null;
// Check Admin
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists() || userDoc.data().isAdmin !== true) {
    alert("Access Denied ❌");
    window.location.href = "home.html";
    return;
  }

  loadProducts();

});

// Save Product
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    const productData = {

  image: document.getElementById("image").value,
  productName: document.getElementById("productName").value,
  category: document.getElementById("category").value,
  price: document.getElementById("price").value,
  description: document.getElementById("description").value

};

if (editMode) {

  await updateDoc(
    doc(db, "products", editProductId),
    productData
  );

  alert("Product Updated Successfully ✅");

  editMode = false;
  editProductId = null;

  form.querySelector("button").innerText = "Save Product";

} else {

  await addDoc(
    collection(db, "products"),
    productData
  );

  alert("Product Added Successfully ✅");

}

    alert("Product Added Successfully ✅");

    form.reset();

    loadProducts();

  } catch (error) {

    alert(error.message);

  }

});

// Load Products
async function loadProducts() {

  const querySnapshot = await getDocs(collection(db, "products"));

  productsDiv.innerHTML = "";

  querySnapshot.forEach((docSnap) => {

    const product = docSnap.data();

    productsDiv.innerHTML += `
      <div class="card">

        <img src="${product.image}" alt="${product.productName}">

        <div class="card-content">

  <h3>${product.productName}</h3>

  <p>${product.category}</p>

  <p class="price">₹${product.price}</p>

  <p>${product.description}</p>

  <button onclick="editProduct('${docSnap.id}')">
    ✏️ Edit
  </button>

  <br><br>

  <button
    style="background:red"
    onclick="deleteProduct('${docSnap.id}')">
    🗑️ Delete
  </button>

</div>

      </div>
    `;

  });

}

window.deleteProduct = async function(id){

  const ok = confirm("Delete this product?");

  if(!ok) return;

  await deleteDoc(doc(db,"products",id));

  alert("Product Deleted ✅");

  loadProducts();

};

window.editProduct = async function(id) {

  try {

    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      alert("Product Not Found");
      return;
    }

    const product = productSnap.data();

    document.getElementById("image").value = product.image;
    document.getElementById("productName").value = product.productName;
    document.getElementById("category").value = product.category;
    document.getElementById("price").value = product.price;
    document.getElementById("description").value = product.description;

    editMode = true;
    editProductId = id;

    form.querySelector("button").innerText = "Update Product";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

};
