import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useClinicAuthStore } from "../store/clinicAuthStore";
import {
  Building2,
  Menu,
  X,
  Home,
  Calendar,
  Users,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Bell,
  MessageSquare,
} from "lucide-react";

function ClinicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clinic, clinicLogout } = useClinicAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await clinicLogout();
    navigate("/clinicLogin");
  };

  const navLinks = [
    { name: "Dashboard", path: "/clinicHome", icon: Home },
    { name: "Doctors", path: "/clinicDoctors", icon: Users },
    { name: "Appointments", path: "/clinicAppointments", icon: Calendar },
    { name: "Patients", path: "/clinicPatients", icon: Users },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/clinicHome" className="flex items-center space-x-2">
              <div className="bg-teal-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  {clinic?.clinicName || "Clinic Portal"}
                </h1>
                <p className="text-xs text-gray-500">Healthcare Management</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={()=> navigate("/clinicNotifications")} className="hidden md:block relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center">
                  {clinic?.profilePicture ? (
                    <img
                      src={clinic.profilePicture}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {clinic?.clinicName}
                  </p>
                  <p className="text-xs text-gray-500">{clinic?.city}</p>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {clinic?.ownerName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {clinic?.email}
                      </p>
                    </div>

                    <Link
                      to="/clinicProfile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/clinicSettings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="border-t border-gray-200 my-2"></div>

            <Link
              to="/clinicProfile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">My Profile</span>
            </Link>

            <Link
              to="/clinicSettings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default ClinicNavbar;
