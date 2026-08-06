import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const welcome = document.getElementById("welcome");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      welcome.innerHTML = `
        👋 Welcome <b>${data.name}</b>
      `;

    } else {

      welcome.innerHTML = `
        👋 Welcome ${user.email}
      `;

    }

  } catch (error) {

    console.log(error);

    welcome.innerHTML = `
      👋 Welcome ${user.email}
    `;

  }

});
