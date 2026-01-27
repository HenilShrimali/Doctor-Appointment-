import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClinicAuthStore } from "../store/clinicAuthStore";
import {
  Users,
  Calendar,
  UserCheck,
  TrendingUp,
  Plus,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";

function ClinicHome() {
  const navigate = useNavigate();
  const { clinic } = useClinicAuthStore();

  // TODO: Replace with actual data from API
  const stats = {
    totalDoctors: 5,
    totalAppointments: 48,
    todayAppointments: 12,
    totalPatients: 234,
    completedToday: 8,
    upcomingToday: 4,
  };

  // TODO: Replace with actual doctors data from API
  const recentDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      appointments: 15,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Pediatrician",
      appointments: 12,
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialization: "Dermatologist",
      appointments: 10,
    },
  ];

  // TODO: Replace with actual appointments data from API
  const todayAppointments = [
    {
      id: 1,
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      time: "10:00 AM",
      status: "upcoming",
    },
    {
      id: 2,
      patient: "Jane Smith",
      doctor: "Dr. Michael Chen",
      time: "11:30 AM",
      status: "completed",
    },
    {
      id: 3,
      patient: "Bob Wilson",
      doctor: "Dr. Emily Davis",
      time: "2:00 PM",
      status: "upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {clinic?.clinicName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your clinic today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate("/clinicDoctors")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">
                  Total Doctors
                </p>
                <p className="text-4xl font-black">{stats.totalDoctors}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate("/clinicAppointments")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">
                  Total Appointments
                </p>
                <p className="text-4xl font-black">{stats.totalAppointments}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold mb-1">
                  Today's Appointments
                </p>
                <p className="text-4xl font-black">{stats.todayAppointments}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate("/clinicPatients")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">
                  Total Patients
                </p>
                <p className="text-4xl font-black">{stats.totalPatients}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/clinicDoctors")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Add Doctor
                  </span>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => navigate("/clinicDoctors")}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    View Doctors
                  </span>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
              </button>

              <button
                onClick={() => navigate("/clinicAppointments")}
                className="w-full flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    View Appointments
                  </span>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Today's Overview
              </h2>
              <button
                onClick={() => navigate("/clinicAppointments")}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-gray-600">
                    Completed
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedToday}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-600">
                    Upcoming
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.upcomingToday}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {todayAppointments.slice(0, 3).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{apt.patient}</p>
                    <p className="text-sm text-gray-600">{apt.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {apt.time}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Doctors</h2>
            <button
              onClick={() => navigate("/clinicDoctors")}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {doctor.name.split(" ")[1].charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-gray-600">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Appointments</span>
                  <span className="font-bold text-blue-600">
                    {doctor.appointments}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicHome;
