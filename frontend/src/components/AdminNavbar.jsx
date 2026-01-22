import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserAuthStore } from "../store/userAuthStore";
import {
  FileText,
  Stethoscope,
  Users,
  Calendar,
  LogOut,
  Menu,
  X,
  Shield,
  Building2,
} from "lucide-react";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userLogout } = useUserAuthStore();

  const handleLogout = async () => {
    await userLogout();
    navigate("/userLogin");
  };

  const navItems = [
    {
      name: "Clinic Requests",
      path: "/admin/clinicRequests",
      icon: FileText,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Doctors",
      path: "/admin/doctors",
      icon: Stethoscope,
    },
    {
      name: "Clinics",
      path: "/admin/clinics",
      icon: Building2,
    },
    {
      name: "Appointments",
      path: "/admin/appointments",
      icon: Calendar,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-white text-lg sm:text-xl font-black">
                DocTrek Admin
              </h1>
              <p className="text-white/80 text-xs font-medium hidden sm:block">
                Doctor Appointment Management System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-white text-blue-600 shadow-lg scale-105"
                      : "text-white hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-300 ml-2 shadow-lg hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-lg"
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

export default AdminNavbar;
