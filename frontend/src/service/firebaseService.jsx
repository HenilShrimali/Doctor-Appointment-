import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const saveFCMToken = async (token, userType) => {
  try {
    await axios.post(
      `http://localhost:5000/api/fcm-token/${userType}/save`,
      { token, device: "web" },
      { withCredentials: true },
    );
    console.log("FCM token saved");
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};


export const requestNotificationPermission = async (userType) => {
  try {
    if (!("Notification" in window)) {
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      return null;
    }

    const currentPermission = Notification.permission;

    if (currentPermission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        await saveFCMToken(token, userType);
        return token;
      }
      return null;
    }

    if (currentPermission === "denied") {
      return null;
    }

    if (currentPermission === "default") {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (token) {
          await saveFCMToken(token, userType);
          return token;
        }
      }
      return null;
    }
  } catch (error) {
    console.error("Notification error:", error);
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
    console.log("FCM token removed");
  } catch (error) {
    console.error("Error removing FCM token:", error);
  }
};

export const listenForMessages = (onMessageReceived) => {
  onMessage(messaging, (payload) => {
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
    const token = await requestNotificationPermission(userType);

    if (token) {
      listenForMessages(onMessageReceived);
    }

  } catch (error) {
    console.error("FCM init error:", error);
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
