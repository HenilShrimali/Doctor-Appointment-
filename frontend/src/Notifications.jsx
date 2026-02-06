import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "./store/notificationStore";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  DollarSign,
  Stethoscope,
  Building2,
  Clock,
  Pill,
  User,
  Loader,
} from "lucide-react";

function Notifications({ userType = "user" }) {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    isLoading,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
    getUnreadCount,
  } = useNotificationStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState("all"); 
  const dropdownRef = useRef(null);

  useEffect(() => {
    getNotifications(userType);
    getUnreadCount(userType);

    const notificationInterval = setInterval(() => {
      getNotifications(userType); 
      getUnreadCount(userType); 
    }, 10000); 

    return () => clearInterval(notificationInterval);
  }, [userType, getNotifications, getUnreadCount]);

  useEffect(() => {
    if (showDropdown) {
      getNotifications(userType); 
      getUnreadCount(userType);
    }
  }, [showDropdown, userType, getNotifications, getUnreadCount]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id, userType);
    }

    if (notification.link) {
      setShowDropdown(false);
      navigate(notification.link);
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId, userType);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(userType);
  };

  const handleClearAllRead = async () => {
    await clearAllRead(userType);
  };

  const getIcon = (type) => {
    const iconMap = {
      appointment_confirmed: <Check className="w-5 h-5" />,
      new_appointment: <Calendar className="w-5 h-5" />,
      appointment_cancelled: <X className="w-5 h-5" />,
      appointment_reminder: <Clock className="w-5 h-5" />,
      prescription_ready: <Pill className="w-5 h-5" />,
      payment_success: <DollarSign className="w-5 h-5" />,
      doctor_approved: <Stethoscope className="w-5 h-5" />,
      clinic_approved: <Building2 className="w-5 h-5" />,
      general: <Bell className="w-5 h-5" />,
    };
    return iconMap[type] || <Bell className="w-5 h-5" />;
  };

  const getIconColor = (type) => {
    const colorMap = {
      appointment_confirmed: "text-emerald-600 bg-emerald-50",
      new_appointment: "text-purple-600 bg-purple-50",
      appointment_cancelled: "text-red-600 bg-red-50",
      appointment_reminder: "text-amber-600 bg-amber-50",
      prescription_ready: "text-teal-600 bg-teal-50",
      payment_success: "text-green-600 bg-green-50",
      doctor_approved: "text-emerald-600 bg-emerald-50",
      clinic_approved: "text-emerald-600 bg-emerald-50",
      general: "text-gray-600 bg-gray-50",
    };
    return colorMap[type] || "text-gray-600 bg-gray-50";
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                Notifications
              </h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  filter === "all"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  filter === "unread"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
                <button
                  onClick={handleClearAllRead}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear read
                </button>
              </div>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-medium">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "Notifications will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer transition group hover:bg-gray-50 ${
                      !notification.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(notification.type)}`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-0.5">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>

                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.createdAt)}
                          </span>

                          <button
                            onClick={(e) => handleDelete(e, notification._id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-center text-gray-500">
                Showing {filteredNotifications.length} of {notifications.length}{" "}
                notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
