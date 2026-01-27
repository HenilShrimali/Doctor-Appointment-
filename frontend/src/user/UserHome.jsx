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
} from "lucide-react";

function UserHome() {
  const { user } = useUserAuthStore();
  const { getAvailableDoctors, doctors, isLoading } = useAppointmentStore();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]}!
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
                      Dr. {doctor.name}
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
    </div>
  );
}

export default UserHome;
