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

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Cache functionality (from service-worker.js)
const CACHE_NAME = 'my-app-cache';
const urlsToCache = ['/', '/index.html', '/static/js/main.js'];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener("push", function (e) {
  console.log(e.data.text())

  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle messages to skip waiting
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
self.addEventListener("notificationclick", function (event) {
  const url = "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});

// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });