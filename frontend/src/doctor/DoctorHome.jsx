import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctorAuthStore } from "../store/doctorAuthStore";
import { useDoctorAppointmentStore } from "../store/doctorAppointmentStore";
import { useDoctorPatientStore } from "../store/doctorPatientStore";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Stethoscope,
  Activity,
  Sun,
  Moon,
  Coffee,
  Loader,
  Heart,
} from "lucide-react";

function DoctorHome() {
  const navigate = useNavigate();
  const { doctor } = useDoctorAuthStore();
  const {
    appointments,
    getDoctorAppointments,
    isLoading: appointmentsLoading,
  } = useDoctorAppointmentStore();
  const {
    patients,
    getPatients,
    isLoading: patientsLoading,
  } = useDoctorPatientStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getDoctorAppointments();
    getPatients();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12)
      return {
        text: "Good Morning",
        icon: Sun,
        color: "from-amber-500 to-orange-500",
      };
    if (hour < 17)
      return {
        text: "Good Afternoon",
        icon: Coffee,
        color: "from-blue-500 to-cyan-500",
      };
    return {
      text: "Good Evening",
      icon: Moon,
      color: "from-indigo-500 to-purple-500",
    };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= today && aptDate < tomorrow;
  });

  const completedToday = todayAppointments.filter(
    (apt) => apt.status === "completed",
  ).length;
  const upcomingToday = todayAppointments.filter(
    (apt) => apt.status === "confirmed" || apt.status === "pending",
  ).length;

  const stats = {
    todayAppointments: todayAppointments.length,
    completedToday,
    upcomingToday,
    totalPatients: patients.length,
  };

  const upcomingAppointments = todayAppointments
    .filter((apt) => apt.status === "confirmed" || apt.status === "pending")
    .sort((a, b) => {
      const timeA = convertTo24Hour(a.startTime);
      const timeB = convertTo24Hour(b.startTime);
      return timeA.localeCompare(timeB);
    });

  const nextAppointment = upcomingAppointments[0];

  const recentPatients = patients
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 3);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= oneWeekAgo && aptDate < tomorrow;
  });

  const isLoading = appointmentsLoading || patientsLoading;

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${greeting.color} rounded-full flex items-center justify-center shadow-lg`}
            >
              <GreetingIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {greeting.text}, Dr. {doctor?.name?.split(" ").pop()}!
              </h1>
              <p className="text-lg text-gray-600">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                •{" "}
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {nextAppointment && (
          <div className="mb-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">
                    Next Appointment
                  </p>
                  <h3 className="text-2xl font-bold">
                    {nextAppointment.userId?.name || "Patient"}
                  </h3>
                  <p className="text-blue-100 mt-1">
                    {nextAppointment.startTime} •{" "}
                    {nextAppointment.symptoms?.substring(0, 50)}
                    {nextAppointment.symptoms?.length > 50 ? "..." : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/doctorAppointments")}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/doctorAppointments")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-semibold mb-1">
                  Today's Appointments
                </p>
                <p className="text-4xl font-black">{stats.todayAppointments}</p>
                <p className="text-teal-100 text-xs mt-1">
                  {stats.todayAppointments === 1 ? "Patient" : "Patients"} to
                  see!
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">
                  Completed Today
                </p>
                <p className="text-4xl font-black">{stats.completedToday}</p>
                <p className="text-blue-100 text-xs mt-1">Great progress!</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">
                  Remaining Today
                </p>
                <p className="text-4xl font-black">{stats.upcomingToday}</p>
                <p className="text-purple-100 text-xs mt-1">Keep going!</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/doctorPatients")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">
                  Total Patients
                </p>
                <p className="text-4xl font-black">{stats.totalPatients}</p>
                <p className="text-orange-100 text-xs mt-1">Lives touched!</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/doctorSchedule")}
                className="w-full flex items-center justify-between p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Manage Schedule
                  </span>
                </div>
                <Activity className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
              </button>

              <button
                onClick={() => navigate("/doctorAppointments")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    View Appointments
                  </span>
                </div>
                <Activity className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => navigate("/doctorPatients")}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Patient Records
                  </span>
                </div>
                <Activity className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Today's Schedule
              </h2>
              <button
                onClick={() => navigate("/doctorAppointments")}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-600">
                    Completed
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedToday}
                </p>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-semibold text-gray-600">
                    Upcoming
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.upcomingToday}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                todayAppointments
                  .sort((a, b) => {
                    const timeA = convertTo24Hour(a.startTime);
                    const timeB = convertTo24Hour(b.startTime);
                    return timeA.localeCompare(timeB);
                  })
                  .map((apt) => (
                    <div
                      key={apt._id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        apt.status === "completed"
                          ? "bg-gray-50 border-gray-200"
                          : "bg-teal-50 border-teal-200 hover:shadow-md"
                      }`}
                      onClick={() => navigate("/doctorAppointments")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">
                              {apt.userId?.name || "Patient"}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {apt.symptoms}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm text-gray-500">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {apt.startTime}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-bold ${
                              apt.status === "completed"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-teal-500 text-white"
                            }`}
                          >
                            {apt.status === "completed" ? "✓ Done" : "Next"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Recent Patients
              </h2>
              <button
                onClick={() => navigate("/doctorPatients")}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentPatients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No patients yet</p>
                </div>
              ) : (
                recentPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => navigate("/doctorPatients")}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          patient.profilePicture ||
                          `https://ui-avatars.com/api/?name=${patient.name}&size=40&background=14b8a6&color=fff&bold=true`
                        }
                        alt={patient.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {patient.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {patient.appointmentCount}{" "}
                          {patient.appointmentCount === 1 ? "visit" : "visits"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Today's Progress
            </h2>

            <div className="space-y-6">
              {stats.todayAppointments > 0 ? (
                <>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-gray-700">
                          Appointments Progress
                        </span>
                        <span className="text-xs px-3 py-1 bg-teal-500 text-white rounded-full font-bold">
                          {Math.round(
                            (stats.completedToday / stats.todayAppointments) *
                              100,
                          )}
                          % Complete
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{
                            width: `${(stats.completedToday / stats.todayAppointments) * 100}%`,
                          }}
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-sm">
                        <span className="text-gray-600">
                          <strong className="text-teal-600">
                            {stats.completedToday}
                          </strong>{" "}
                          of {stats.todayAppointments} completed
                        </span>
                        <span className="text-gray-600">
                          <strong className="text-purple-600">
                            {stats.upcomingToday}
                          </strong>{" "}
                          remaining
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                          This Week
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          weekAppointments.filter(
                            (a) => a.status === "completed",
                          ).length
                        }
                      </p>
                      <p className="text-xs text-blue-700 mt-1">Completed</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                          Total
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          appointments.filter((a) => a.status === "completed")
                            .length
                        }
                      </p>
                      <p className="text-xs text-purple-700 mt-1">
                        All consultations
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                  <p className="font-semibold">No appointments today</p>
                  <p className="text-sm mt-1">Your schedule is clear!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group ">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          <button
            onClick={() => navigate("/doctorAppointments")}
            className="relative w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
          >
            <Stethoscope className="w-8 h-8 text-white animate-bounce" />
          </button>
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap">
              View Appointments
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

export default DoctorHome;
