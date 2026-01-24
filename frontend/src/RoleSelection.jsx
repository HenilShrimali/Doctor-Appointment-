import React, { useState } from "react";
import { Users, Building2, Stethoscope, ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: "user",
      title: "Patient",
      subtitle: "Book & Manage Care",
      description:
        "Book appointments with qualified doctors, manage your health records, and get care when you need it",
      icon: Users,
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-600",
      lightBg: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      path: "/userSignup",
      benefits: ["Easy booking", "Health records", "Appointment reminders"],
    },
    {
      id: "clinic",
      title: "Clinic/Hospital",
      subtitle: "Manage Operations",
      description:
        "Manage multiple doctors, handle patient appointments, and streamline your clinic operations effortlessly",
      icon: Building2,
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-600",
      lightBg: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      path: "/clinicSignup",
      benefits: ["Team management", "Patient tracking", "Analytics dashboard"],
    },
    {
      id: "doctor",
      title: "Doctor",
      subtitle: "Grow Your Practice",
      description:
        "Set your schedule, manage patients, build your professional profile, and grow your practice with ease",
      icon: Stethoscope,
      gradientFrom: "from-cyan-500",
      gradientTo: "to-blue-500",
      lightBg: "bg-cyan-50",
      borderColor: "border-cyan-200",
      textColor: "text-cyan-600",
      path: "/doctorLogin",
      benefits: ["Schedule control", "Patient management", "Practice growth"],
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setIsNavigating(true);
    navigate(role.path);
  };

  return (
    <div className="min-h-screen md:h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 overflow-y-auto md:overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen md:h-full flex flex-col">
        <nav className="backdrop-blur-sm bg-white/30 border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-36 sm:h-14 md:h-16 flex items-center">
            <img
              src="/logo.png"
              alt="DocTrek Logo"
              className="
              object-contain
              h-32 sm:h-32 md:h-20 lg:h-32"
            />
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-4 md:overflow-hidden">
          <div className="text-center mb-4 sm:mb-6 md:mb-6 max-w-2xl">
            <div className="mb-4 sm:mb-5 md:mb-6 inline-block">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 md:py-2 rounded-full text-xs sm:text-xs md:text-sm font-medium">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Welcome to DocTrek
              </div>
            </div>

            <p className="text-sm sm:text-sm md:text-base text-slate-600 leading-relaxed px-1 sm:px-2 md:px-0">
              Connect with healthcare professionals, manage your practice, or
              streamline your clinic operations. Choose your role to get started
              in seconds.
            </p>
          </div>

          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-0 px-1 sm:px-0">
            {roles.map((role, index) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              const isHovered = hoveredCard === role.id;
              const isNavigatingToThis =
                isNavigating && selectedRole === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  onMouseEnter={() => setHoveredCard(role.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  disabled={isNavigating && !isNavigatingToThis}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-left active:scale-95 sm:active:scale-100"
                  style={{
                    animation: `slideUp 0.6s ease-out forwards`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <style>{`
                    @keyframes slideUp {
                      from {
                        opacity: 0;
                        transform: translateY(30px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>

                  <div className="absolute inset-0 bg-white border border-slate-200 group-hover:border-slate-300 transition-all duration-500 shadow-md group-hover:shadow-xl rounded-xl sm:rounded-2xl"></div>

                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${role.gradientFrom} ${role.gradientTo} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl sm:rounded-2xl`}
                  ></div>

                  <div className="relative p-4 sm:p-5 md:p-6 h-full flex flex-col justify-between">
                    <div>
                      <div
                        className={`mb-3 sm:mb-4 md:mb-6 inline-flex w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${role.gradientFrom} ${role.gradientTo} text-white shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:scale-110`}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </div>

                      <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-1">
                        {role.title}
                      </h3>
                      <p
                        className={`text-xs sm:text-xs md:text-sm font-semibold ${role.textColor} mb-2 sm:mb-3 md:mb-4 transition-colors duration-300`}
                      >
                        {role.subtitle}
                      </p>

                      <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 text-xs sm:text-xs md:text-sm leading-relaxed mb-3 sm:mb-4 md:mb-6">
                        {role.description}
                      </p>

                      <div
                        className={`space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4 md:mb-6 overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-40 opacity-0 group-hover:opacity-100`}
                      >
                        {role.benefits.map((benefit, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 sm:gap-2.5 md:gap-3"
                          >
                            <div
                              className={`w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br ${role.gradientFrom} ${role.gradientTo} flex items-center justify-center flex-shrink-0`}
                            >
                              <svg
                                className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-xs sm:text-xs md:text-sm text-slate-700 font-medium">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 sm:pt-4 md:pt-6 border-t border-slate-200 group-hover:border-slate-300 transition-colors duration-300">
                      <span className="text-xs sm:text-xs md:text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors duration-300">
                        Get Started
                      </span>
                      <div
                        className={`w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${role.gradientFrom} ${role.gradientTo} flex items-center justify-center text-white transition-all duration-300 transform group-hover:translate-x-1 ${isNavigatingToThis ? "translate-x-2 scale-110" : ""}`}
                      >
                        <ArrowRight className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                      </div>
                    </div>
                  </div>

                  {(isSelected || isNavigatingToThis) && (
                    <div
                      className={`absolute inset-0 border-2 rounded-xl sm:rounded-2xl transition-all duration-500 ${
                        isNavigatingToThis
                          ? `border-blue-500 shadow-lg shadow-blue-500/30`
                          : "border-slate-300"
                      }`}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
