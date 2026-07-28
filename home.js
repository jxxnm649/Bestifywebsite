import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});
