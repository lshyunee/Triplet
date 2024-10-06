/*global */
// Import Firebase Messaging scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4x1cWZkZQgMaZa4HnVtDQVpuIwkpiCV8",
  authDomain: "triplet-9eff1.firebaseapp.com",
  projectId: "triplet-9eff1",
  storageBucket: "triplet-9eff1.appspot.com",
  messagingSenderId: "251492838185",
  appId:"1:251492838185:web:db33b14e568c9b7e57a538",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

self.addEventListener("push", function (e) {
  console.log(e.data.text())

  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  const url = "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});

// messaging.onBackgroundMessage(function(payload) {
//   console.log('background 푸시 알림 ->', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });