import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: "AIzaSyA4_LxSn8c-52ZpjJ2nOHXnm0SbgLsHZrM",
  authDomain: "doctrek---doctor-appointment.firebaseapp.com",
  projectId: "doctrek---doctor-appointment",
  storageBucket: "doctrek---doctor-appointment.firebasestorage.app",
  messagingSenderId: "149508306728",
  appId: "1:149508306728:web:928c151738030b5502c21d",
  measurementId: "G-G70KCPLY9N",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const saveFCMToken = async (token, userType) => {
  try {
    console.log(
      `Saving FCM token for ${userType}:`,
      token.substring(0, 20) + "...",
    );

    const response = await axios.post(
      `http://localhost:5000/api/fcm-token/${userType}/save`,
      { token, device: "web" },
      { withCredentials: true },
    );

    if (response.data.success) {
      console.log("✅ FCM token saved successfully");
      return true;
    } else {
      console.error("❌ Failed to save FCM token:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error(
      "❌ Error saving FCM token:",
      error.response?.data || error.message,
    );
    return false;
  }
};

const registerServiceWorker = async () => {
  try {
    if (!("serviceWorker" in navigator)) {
      console.error("❌ Service Worker not supported");
      return null;
    }

    await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    console.log("✅ Service Worker registration initiated");

    const registration = await navigator.serviceWorker.ready;
    console.log("✅ Service Worker ready:", registration);

    return registration;
  } catch (error) {
    console.error("❌ Service Worker registration failed:", error);
    throw error;
  }
};

export const requestNotificationPermission = async (userType) => {
  try {
    if (!("Notification" in window)) {
      console.error("❌ Notifications not supported in this browser");
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      console.error("❌ Service Worker not supported");
      return null;
    }

    console.log("🔔 Starting notification setup...");

    const swRegistration = await registerServiceWorker();

    if (!swRegistration) {
      console.error("❌ Service Worker registration failed");
      return null;
    }

    const currentPermission = Notification.permission;
    console.log("Current notification permission:", currentPermission);

    if (currentPermission === "granted") {
      console.log("✅ Permission already granted, getting token...");

      try {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: swRegistration,
        });

        if (token) {
          console.log("✅ FCM Token received:", token.substring(0, 30) + "...");
          await saveFCMToken(token, userType);
          return token;
        } else {
          console.error(
            "❌ No FCM token received - check VAPID key and Firebase config",
          );
          return null;
        }
      } catch (tokenError) {
        console.error("❌ Error getting FCM token:", tokenError);
        console.error("Token error details:", {
          code: tokenError.code,
          message: tokenError.message,
          stack: tokenError.stack,
        });

        if (tokenError.code === "messaging/token-subscribe-failed") {
          console.error("⚠️ Push service error - check:");
          console.error("1. VAPID key is correct");
          console.error("2. Firebase project settings");
          console.error("3. Service worker is properly registered");
        }

        return null;
      }
    }

    if (currentPermission === "denied") {
      console.warn("⚠️ Notification permission denied by user");
      toast.error("Please enable notifications in your browser settings");
      return null;
    }

    if (currentPermission === "default") {
      console.log("⚠️ Requesting notification permission...");

      const permission = await Notification.requestPermission();
      console.log("Permission result:", permission);

      if (permission === "granted") {
        console.log("✅ Permission granted, getting token...");

        try {
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: swRegistration,
          });

          if (token) {
            console.log(
              "✅ FCM Token received:",
              token.substring(0, 30) + "...",
            );
            await saveFCMToken(token, userType);
            return token;
          } else {
            console.error("❌ No FCM token received");
            return null;
          }
        } catch (tokenError) {
          console.error("❌ Error getting FCM token:", tokenError);
          return null;
        }
      } else {
        console.warn("⚠️ User denied notification permission");
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("❌ Notification setup error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return null;
  }
};

export const removeFCMToken = async (token, userType) => {
  try {
    await axios.post(
      `http://localhost:5000/api/fcm-token/${userType}/remove`,
      { token },
      { withCredentials: true },
    );
    console.log("✅ FCM token removed");
  } catch (error) {
    console.error("❌ Error removing FCM token:", error);
  }
};

export const listenForMessages = (onMessageReceived) => {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message received:", payload);

    const { title, body } = payload.notification || {};

    if (title && body) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-2xl">🔔</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="mt-1 text-sm text-gray-500">{body}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  if (payload.data?.link) {
                    window.location.href = payload.data.link;
                  }
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                View
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
        },
      );
    }

    if (onMessageReceived) {
      onMessageReceived(payload);
    }
  });
};

export const initializeFCM = async (userType, onMessageReceived) => {
  try {
    console.log(`🔔 Initializing FCM for ${userType}...`);

    const token = await requestNotificationPermission(userType);

    if (token) {
      console.log("✅ FCM initialized successfully, listening for messages...");
      listenForMessages(onMessageReceived);
    } else {
      console.warn("⚠️ No FCM token obtained - notifications will not work");
    }
  } catch (error) {
    console.error("❌ FCM initialization error:", error);
  }
};

export const requestPermissionManually = async (userType) => {
  return await requestNotificationPermission(userType);
};

export default {
  requestNotificationPermission,
  removeFCMToken,
  listenForMessages,
  initializeFCM,
  requestPermissionManually,
};
