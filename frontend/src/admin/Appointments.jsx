import React, { useEffect, useState } from "react";
import { useAdminStore } from "../store/adminStore";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Eye,
  FileText,
} from "lucide-react";

function Appointments() {
  const {
    appointments,
    stats,
    getAppointments,
    getAppointmentStats,
    isLoading,
  } = useAdminStore();

  const [filters, setFilters] = useState({
    status: "all",
    clinicId: "all",
    doctorId: "all",
    date: "",
    search: "",
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    getAppointments();
    getAppointmentStats();
  }, []);

  const uniqueClinics = [
    ...new Map(
      appointments
        .filter((apt) => apt.clinicId)
        .map((apt) => [apt.clinicId._id, apt.clinicId]),
    ).values(),
  ];

  const uniqueDoctors = [
    ...new Map(
      appointments
        .filter((apt) => apt.doctorId)
        .map((apt) => [apt.doctorId._id, apt.doctorId]),
    ).values(),
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus =
      filters.status === "all" || apt.status === filters.status;

    const matchesClinic =
      filters.clinicId === "all" || apt.clinicId?._id === filters.clinicId;

    const matchesDoctor =
      filters.doctorId === "all" || apt.doctorId?._id === filters.doctorId;

    const matchesDate =
      !filters.date ||
      new Date(apt.appointmentDate).toISOString().split("T")[0] ===
        filters.date;

    const matchesSearch =
      !filters.search ||
      apt.userId?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      apt.doctorId?.name
        ?.toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      apt.clinicId?.clinicName
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

    return (
      matchesStatus &&
      matchesClinic &&
      matchesDoctor &&
      matchesDate &&
      matchesSearch
    );
  });

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle,
        label: "Confirmed",
      },
      completed: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: CheckCircle,
        label: "Completed",
      },
      cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle,
        label: "Cancelled",
      },
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: AlertCircle,
        label: "Pending",
      },
    };
    return configs[status] || configs.pending;
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Time",
      "Patient",
      "Doctor",
      "Clinic",
      "Status",
      "Amount",
      "Payment Status",
    ];
    const rows = filteredAppointments.map((apt) => [
      new Date(apt.appointmentDate).toLocaleDateString(),
      apt.startTime,
      apt.userId?.name || "N/A",
      apt.doctorId?.name || "N/A",
      apt.clinicId?.clinicName || "N/A",
      apt.status,
      apt.amount,
      apt.paymentStatus,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-appointments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            All Appointments
          </h1>
          <p className="text-gray-600">
            System-wide appointment management and analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats?.completed || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Upcoming
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats?.upcoming || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Cancelled
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats?.cancelled || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Revenue
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{stats?.revenue || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient, doctor, or clinic..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.clinicId}
              onChange={(e) =>
                setFilters({ ...filters, clinicId: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Clinics</option>
              {uniqueClinics.map((clinic) => (
                <option key={clinic._id} value={clinic._id}>
                  {clinic.clinicName}
                </option>
              ))}
            </select>

            <select
              value={filters.doctorId}
              onChange={(e) =>
                setFilters({ ...filters, doctorId: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Doctors</option>
              {uniqueDoctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                     {doctor.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                title="Export to CSV"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {(filters.status !== "all" ||
            filters.clinicId !== "all" ||
            filters.doctorId !== "all" ||
            filters.date ||
            filters.search) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.status !== "all" && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  Status: {filters.status}
                </span>
              )}
              {filters.clinicId !== "all" && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
                  Clinic:{" "}
                  {
                    uniqueClinics.find((c) => c._id === filters.clinicId)
                      ?.clinicName
                  }
                </span>
              )}
              {filters.doctorId !== "all" && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                  Doctor:{" "}
                  {uniqueDoctors.find((d) => d._id === filters.doctorId)?.name}
                </span>
              )}
              {filters.date && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                  Date: {new Date(filters.date).toLocaleDateString()}
                </span>
              )}
              {filters.search && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                  Search: {filters.search}
                </span>
              )}
              <button
                onClick={() =>
                  setFilters({
                    status: "all",
                    clinicId: "all",
                    doctorId: "all",
                    date: "",
                    search: "",
                  })
                }
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <strong>{filteredAppointments.length}</strong> of{" "}
            <strong>{appointments.length}</strong> appointments
          </p>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Appointments Found
            </h2>
            <p className="text-gray-600">
              {filters.status !== "all" ||
              filters.clinicId !== "all" ||
              filters.date
                ? "Try adjusting your filters"
                : "No appointments in the system yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const statusConfig = getStatusConfig(apt.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={apt._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Patient
                              </p>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <p className="font-semibold text-gray-900">
                                  {apt.userId?.name || "N/A"}
                                </p>
                              </div>
                              {apt.userId?.phone && (
                                <p className="text-sm text-gray-600 ml-6">
                                  {apt.userId.phone}
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Doctor
                              </p>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-teal-600" />
                                <p className="font-semibold text-gray-900">
                                     {apt.doctorId?.name || "N/A"}
                                </p>
                              </div>
                              {apt.doctorId?.specialization && (
                                <p className="text-sm text-gray-600 ml-6">
                                  {apt.doctorId.specialization}
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Clinic
                              </p>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-purple-600" />
                                <p className="font-semibold text-gray-900">
                                  {apt.clinicId?.clinicName || "N/A"}
                                </p>
                              </div>
                              {apt.clinicId?.city && (
                                <p className="text-sm text-gray-600 ml-6">
                                  {apt.clinicId.city}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(
                                  apt.appointmentDate,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {apt.startTime} - {apt.endTime}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                              <DollarSign className="w-4 h-4" />
                              <span>₹{apt.amount}</span>
                            </div>

                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                apt.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {apt.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <button
                        onClick={() => handleViewDetails(apt)}
                        className="self-start text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showDetailsModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Appointment Details
                  </h2>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedAppointment(null);
                    }}
                    className="text-gray-400 hover:rotate-180 transition-all transform hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Patient Information
                    </h3>
                    <div className="space-y-2 text-black">
                      <p className="text-sm">
                        <strong>Name:</strong>{" "}
                        {selectedAppointment.userId?.name}
                      </p>
                      <p className="text-sm">
                        <strong>Phone:</strong>{" "}
                        {selectedAppointment.userId?.phone}
                      </p>
                      <p className="text-sm">
                        <strong>Email:</strong>{" "}
                        {selectedAppointment.userId?.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Doctor Information
                    </h3>
                    <div className="space-y-2 text-black">
                      <p className="text-sm">
                        <strong>Name:</strong> Dr.{" "}
                        {selectedAppointment.doctorId?.name}
                      </p>
                      <p className="text-sm">
                        <strong>Specialization:</strong>{" "}
                        {selectedAppointment.doctorId?.specialization}
                      </p>
                      <p className="text-sm">
                        <strong>Experience:</strong>{" "}
                        {selectedAppointment.doctorId?.experience} years
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Clinic Information
                    </h3>
                    <div className="space-y-2 text-black">
                      <p className="text-sm">
                        <strong>Name:</strong>{" "}
                        {selectedAppointment.clinicId?.clinicName}
                      </p>
                      <p className="text-sm">
                        <strong>City:</strong>{" "}
                        {selectedAppointment.clinicId?.city}
                      </p>
                      <p className="text-sm">
                        <strong>Phone:</strong>{" "}
                        {selectedAppointment.clinicId?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Appointment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-black">
                    <p className="text-sm">
                      <strong>Date:</strong>{" "}
                      {new Date(
                        selectedAppointment.appointmentDate,
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <strong>Time:</strong> {selectedAppointment.startTime} -{" "}
                      {selectedAppointment.endTime}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong>{" "}
                      <span className="capitalize">
                        {selectedAppointment.status}
                      </span>
                    </p>
                    <p className="text-sm">
                      <strong>Amount:</strong> ₹{selectedAppointment.amount}
                    </p>
                    <p className="text-sm">
                      <strong>Payment:</strong>{" "}
                      <span className="capitalize">
                        {selectedAppointment.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {selectedAppointment.symptoms && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-amber-800 mb-2">
                      Symptoms
                    </h3>
                    <p className="text-sm text-amber-900">
                      {selectedAppointment.symptoms}
                    </p>
                  </div>
                )}

                {selectedAppointment.diagnosis && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">
                      Diagnosis
                    </h3>
                    <p className="text-sm text-blue-900">
                      {selectedAppointment.diagnosis}
                    </p>
                  </div>
                )}

                {selectedAppointment.prescription?.length > 0 && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-purple-800 mb-2">
                      Prescription ({selectedAppointment.prescription.length}{" "}
                      medicines)
                    </h3>
                    <div className="space-y-2">
                      {selectedAppointment.prescription.map((med, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-2 rounded border border-purple-100"
                        >
                          <p className="font-semibold text-sm">
                            {med.medicine}
                          </p>
                          <p className="text-xs text-gray-600">
                            {med.dosage} • {med.frequency} • {med.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAppointment.reports?.length > 0 && (
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-teal-800 mb-2">
                      Reports ({selectedAppointment.reports.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedAppointment.reports.map((r, idx) => (
                        <a
                          key={idx}
                          href={r.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 transition"
                        >
                          <FileText className="w-4 h-4 text-teal-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {r.fileName}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
