importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyA4_LxSn8c-52ZpjJ2nOHXnm0SbgLsHZrM",
  authDomain: "doctrek---doctor-appointment.firebaseapp.com",
  projectId: "doctrek---doctor-appointment",
  storageBucket: "doctrek---doctor-appointment.firebasestorage.app",
  messagingSenderId: "149508306728",
  appId: "1:149508306728:web:928c151738030b5502c21d",
  measurementId: "G-G70KCPLY9N",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload,
  );

  const notificationTitle = payload.notification?.title || "DocTrek";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: "/logo.png",
    badge: "/badge.png",
    data: payload.data || {},
    tag: payload.data?.notificationId || "default",
    requireInteraction: false,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.", event);

  event.notification.close();

  const urlToOpen = event.notification.data?.link || "/";
  const fullUrl = new URL(urlToOpen, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === fullUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(fullUrl);
        }
      }),
  );
});
