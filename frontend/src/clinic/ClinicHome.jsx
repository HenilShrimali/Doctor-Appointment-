import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClinicAuthStore } from "../store/clinicAuthStore";
import { useClinicAppointmentStore } from "../store/clinicAppointmentStore";
import { useClinicPatientStore } from "../store/clinicPatientStore";
import { useClinicDoctorStore } from "../store/clinicDoctorStore";
import {
  Users,
  Calendar,
  UserCheck,
  TrendingUp,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  Loader,
  DollarSign,
} from "lucide-react";

function ClinicHome() {
  const navigate = useNavigate();
  const { clinic } = useClinicAuthStore();
  const {
    appointments,
    stats: appointmentStats,
    getClinicAppointments,
    getAppointmentStats,
    isLoading: appointmentsLoading,
  } = useClinicAppointmentStore();
  const { patients, getPatients, isLoading: patientsLoading } = useClinicPatientStore();
  const { doctors, getDoctors, isLoading: doctorsLoading } = useClinicDoctorStore();

  useEffect(() => {
    getClinicAppointments();
    getAppointmentStats();
    getPatients();
    getDoctors();
  }, []);

  // Filter today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= today && aptDate < tomorrow;
  });

  const completedToday = todayAppointments.filter((apt) => apt.status === "completed").length;
  const upcomingToday = todayAppointments.filter(
    (apt) => apt.status === "confirmed" || apt.status === "pending"
  ).length;

  // Get top 3 doctors by appointment count
  const topDoctors = doctors
    .map((doctor) => ({
      ...doctor,
      appointmentCount: appointments.filter((apt) => apt.doctorId?._id === doctor._id).length,
    }))
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 3);

  const isLoading = appointmentsLoading || patientsLoading || doctorsLoading;

  if (isLoading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {clinic?.clinicName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your clinic today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => navigate("/clinicDoctors")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Doctors
                </p>
                <p className="text-3xl font-bold text-gray-900">{doctors.length}</p>
                <p className="text-xs text-gray-500 mt-1">Active doctors</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => navigate("/clinicAppointments")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {appointmentStats?.total || appointments.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Today's Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {todayAppointments.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {completedToday} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => navigate("/clinicPatients")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Patients
                </p>
                <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-xs text-gray-500 mt-1">Unique patients</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold">
                  {appointmentStats?.completed || 0}
                </p>
                <p className="text-blue-100 text-xs mt-1">Total consultations</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold mb-1">
                  Upcoming
                </p>
                <p className="text-3xl font-bold">
                  {appointmentStats?.upcoming || 0}
                </p>
                <p className="text-emerald-100 text-xs mt-1">Scheduled</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">
                  Revenue
                </p>
                <p className="text-3xl font-bold">
                  ₹{appointmentStats?.revenue || 0}
                </p>
                <p className="text-purple-100 text-xs mt-1">Total earned</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

              <button
                onClick={() => navigate("/clinicPatients")}
                className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    View Patients
                  </span>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
              </button>
            </div>
          </div>

          {/* Today's Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Today's Overview
              </h2>
              <button
                onClick={() => navigate("/clinicAppointments")}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
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
                  {completedToday}
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
                  {upcomingToday}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                todayAppointments.slice(0, 4).map((apt) => (
                  <div
                    key={apt._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => navigate("/clinicAppointments")}
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {apt.userId?.name || "Patient"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dr. {apt.doctorId?.name || "Doctor"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {apt.startTime}
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top Doctors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Top Doctors</h2>
            <button
              onClick={() => navigate("/clinicDoctors")}
              className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
            >
              View All
            </button>
          </div>

          {doctors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No doctors registered yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate("/clinicDoctors")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={
                        doctor.profilePicture ||
                        `https://ui-avatars.com/api/?name=${doctor.name}&size=48&background=14b8a6&color=fff&bold=true`
                      }
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        Dr. {doctor.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Appointments</span>
                    <span className="font-bold text-teal-600">
                      {doctor.appointmentCount || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClinicHome;