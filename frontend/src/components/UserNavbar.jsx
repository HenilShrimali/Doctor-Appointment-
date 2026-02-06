import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserAuthStore } from "../store/userAuthStore.js";
import { initializeFCM } from "../service/firebaseService.jsx";
import Notifications from "../Notifications.jsx";
import {
  Home,
  User,
  Calendar,
  Stethoscope,
  FileText,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";

function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userLogout } = useUserAuthStore();

  useEffect(() => {
    initializeFCM("user");
  }, []);

  const handleLogout = async () => {
    await userLogout();
    navigate("/userLogin");
  };

  const navItems = [
    {
      name: "Home",
      path: "/userHome",
      icon: Home,
    },
    {
      name: "Find Doctors",
      path: "/findDoctors",
      icon: Stethoscope,
    },
    {
      name: "My Appointments",
      path: "/myAppointments",
      icon: Calendar,
    },
    {
      name: "Health Records",
      path: "/healthRecords",
      icon: FileText,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          <div
            onClick={() => navigate("/userHome")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md transform group-hover:scale-105 transition-all duration-300">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">
                DocTrek
              </h1>
              <p className="text-gray-500 text-[10px] sm:text-xs font-medium hidden sm:block">
                Your trusted healthcare partner
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    active
                      ? "bg-teal-50 text-teal-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-teal-600" : ""}`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Notifications userType="user" />

            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive("/profile")
                  ? "bg-teal-50 text-teal-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
             
                {user?.profilePicture? <img src={user?.profilePicture} alt="" className="size-8 btn-circle"/>: 
                 <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" /> 
                </div>}
              
              <span className="max-w-[100px] truncate">
                {user?.name?.split(" ")[0] || "Profile"}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bolder text-sm bg-teal-700 text-white border border-gray-300 hover:bg-teal-900 hover:border-gray-400 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Notifications userType="user" />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 p-2 rounded-xl transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-3 sm:px-4 py-4 space-y-2">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-teal-50 rounded-xl border border-teal-100">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    active
                      ? "bg-teal-50 text-teal-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}

            <div className="border-t border-gray-200 my-3"></div>

            <button
              onClick={() => {
                navigate("/profile");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive("/profile")
                  ? "bg-teal-50 text-teal-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <User className="w-5 h-5" />
              My Profile
            </button>

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default UserNavbar;
