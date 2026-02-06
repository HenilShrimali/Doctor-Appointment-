import React, { useEffect, useState } from "react";
import { useUserAuthStore } from "../store/userAuthStore";
import { useAppointmentStore } from "../store/appointmentStore";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Search,
  Heart,
  FileText,
  User,
  Stethoscope,
  Clock,
  MapPin,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

function UserHome() {
  const { user } = useUserAuthStore();
  const { getAvailableDoctors, doctors, isLoading } = useAppointmentStore();
  const navigate = useNavigate();
  const [showMascotMessage, setShowMascotMessage] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("");

  const healthTips = [
    "🥗 Remember to drink 8 glasses of water daily!",
    "🏃‍♂️ Just 30 minutes of exercise can boost your mood!",
    "😴 Quality sleep is essential for good health!",
    "🍎 An apple a day keeps the doctor away!",
    "🧘‍♀️ Take a deep breath and relax your mind!",
    "🌞 Get some sunshine for vitamin D!",
    "🥦 Eat colorful vegetables for better nutrition!",
    "💪 Stay active, stay healthy!",
    "🚶‍♀️ A short walk after meals helps digestion!",
    "🧠 Keep your mind sharp by learning something new!",
    "🥛 Include calcium-rich foods for strong bones!",
    "📵 Take breaks from screens to protect your eyes!",
    "🫀 Manage stress to keep your heart healthy!",
    "🍽️ Eat slowly and mindfully!",
    "🪥 Brush and floss daily for a healthy smile!",
    "🕒 Maintain a regular sleep schedule!",
    "🤸 Stretch daily to improve flexibility!",
    "🍋 Start your day with warm water for better metabolism!",
  ];

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/clinicRequests");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.city) {
      getAvailableDoctors({ city: user.city });
    }
  }, [user?.city]);

  const specializations = [
    { name: "General Physician", icon: Stethoscope, color: "bg-blue-500" },
    { name: "Cardiology", icon: Heart, color: "bg-red-500" },
    { name: "Orthopedic", icon: User, color: "bg-orange-500" },
    { name: "Pediatrics", icon: User, color: "bg-purple-500" },
    { name: "Dermatology", icon: User, color: "bg-teal-500" },
    { name: "Neurology", icon: User, color: "bg-indigo-500" },
  ];

  const quickActions = [
    {
      title: "My Appointments",
      icon: Calendar,
      color: "bg-blue-500",
      path: "/myAppointments",
    },
    {
      title: "Health Records",
      icon: FileText,
      color: "bg-emerald-500",
      path: "/healthRecords",
    },
    {
      title: "My Profile",
      icon: User,
      color: "bg-purple-500",
      path: "/profile",
    },
  ];

  const handleMascotClick = () => {
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    setMascotMessage(randomTip);
    setShowMascotMessage(true);
    setTimeout(() => setShowMascotMessage(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 md:flex items-center gap-1">
            Welcome back,{" "}
            <p className="text-teal-600 text-4xl">{user?.name?.split(" ")[0]}!</p>
          </h1>
          <p className="text-gray-600">How are you feeling today?</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Need Medical Consultation?
              </h2>
              <p className="text-sm text-gray-600">
                Book an appointment with top doctors
              </p>
            </div>
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>

          <button
            onClick={() => navigate("/findDoctors")}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-700" />
            Find Specialist
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specializations.map((spec) => (
              <button
                key={spec.name}
                onClick={() =>
                  navigate(`/findDoctors?specialization=${spec.name}`)
                }
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition group"
              >
                <div
                  className={`${spec.color} w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition`}
                >
                  <spec.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">
                  {spec.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition group text-left"
            >
              <div
                className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {action.title}
              </h4>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading doctors...</span>
            </div>
          </div>
        ) : doctors.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Doctors Near You
              </h3>
              <button
                onClick={() => navigate("/findDoctors")}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.slice(0, 4).map((doctor) => (
                <button
                  key={doctor._id}
                  onClick={() =>
                    navigate(`/findDoctors?doctorId=${doctor._id}`)
                  }
                  className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition text-left"
                >
                  <img
                    src={
                      doctor.profilePicture ||
                      `https://ui-avatars.com/api/?name=${doctor.name}&size=64&background=3b82f6&color=fff&bold=true`
                    }
                    alt={doctor.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {doctor.name}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{doctor.experience}y</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">
                        ₹{doctor.consultationFee}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <DancingDoctorMascot
        onClick={handleMascotClick}
        showMessage={showMascotMessage}
        message={mascotMessage}
        onCloseMessage={() => setShowMascotMessage(false)}
      />
    </div>
  );
}

function DancingDoctorMascot({ onClick, showMessage, message, onCloseMessage }) {
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onClick}
          className="relative group cursor-pointer"
          aria-label="Health tip"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          
          <div className="relative bg-white rounded-full p-4 shadow-2xl border-4 border-teal-500 hover:scale-110 transition-transform duration-300">
            <div className="animate-bounce">
              <svg
                className="w-16 h-16"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="20" r="12" fill="#FCD34D" />
                
                <rect x="20" y="32" width="24" height="28" rx="4" fill="#14B8A6" />
                
                <rect x="26" y="28" width="12" height="8" rx="2" fill="#FFFFFF" />
                
                <rect x="30" y="38" width="4" height="12" fill="#FFFFFF" />
                <rect x="26" y="44" width="12" height="4" fill="#FFFFFF" />
                
                <circle cx="28" cy="18" r="2" fill="#1F2937" />
                <circle cx="36" cy="18" r="2" fill="#1F2937" />
                
                <path
                  d="M 26 24 Q 32 27 38 24"
                  stroke="#1F2937"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                
                <circle cx="16" cy="42" r="4" fill="#FCD34D" className="animate-wiggle" />
                <circle cx="48" cy="42" r="4" fill="#FCD34D" className="animate-wiggle" />
                
                <rect x="14" y="56" width="8" height="6" rx="2" fill="#0F766E" />
                <rect x="42" y="56" width="8" height="6" rx="2" fill="#0F766E" />
              </svg>
            </div>
          </div>

          <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 animate-ping">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>

      {showMessage && (
        <div className="fixed bottom-28 right-6 z-50 animate-slideInRight">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-teal-500 p-4 max-w-xs relative">
            <button
              onClick={onCloseMessage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Health Tip!</p>
                <p className="text-sm text-gray-700">{message}</p>
              </div>
            </div>

            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-teal-500 transform rotate-45"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default UserHome;