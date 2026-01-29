import React, { useEffect, useState } from "react";
import { useAppointmentStore } from "../store/appointmentStore";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Stethoscope,
  Building2,
  FileText,
  Loader,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Pill,
  Download,
  Filter,
  Search,
  ChevronRight,
  Phone,
} from "lucide-react";

function MyAppointments() {
  const { appointments, getUserAppointments, isLoading, cancelAppointment } =
    useAppointmentStore();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    getUserAppointments();
  }, []);

  const tabs = [
    { id: "all", label: "All", count: appointments.length },
    {
      id: "upcoming",
      label: "Upcoming",
      count: appointments.filter(
        (a) => a.status === "confirmed" || a.status === "pending",
      ).length,
    },
    {
      id: "completed",
      label: "Completed",
      count: appointments.filter((a) => a.status === "completed").length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: appointments.filter((a) => a.status === "cancelled").length,
    },
  ];

  const filteredAppointments = appointments.filter((appt) => {
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "upcoming" &&
        (appt.status === "confirmed" || appt.status === "pending")) ||
      appt.status === selectedTab;

    const matchesSearch =
      searchQuery === "" ||
      appt.doctorId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.clinicId?.clinicName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

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

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (reason) {
      try {
        await cancelAppointment(appointmentId, reason);
      } catch (error) {
        console.error("Cancellation error:", error);
      }
    }
  };

  if (isLoading) {
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
            My Appointments
          </h1>
          <p className="text-gray-600">
            View and manage your healthcare appointments
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor or clinic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  selectedTab === tab.id
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery
                ? "No appointments found"
                : selectedTab === "all"
                  ? "No Appointments Yet"
                  : `No ${selectedTab} appointments`}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Book your first consultation to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/findDoctors")}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Find Doctors
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => {
              const statusConfig = getStatusConfig(appt.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedCard === appt._id;

              return (
                <div
                  key={appt._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <img
                        src={
                          appt.doctorId?.profilePicture ||
                          `https://ui-avatars.com/api/?name=${appt.doctorId?.name}&size=80&background=14b8a6&color=fff&bold=true`
                        }
                        alt={appt.doctorId?.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                 {appt.doctorId?.name}
                            </h3>
                            <p className="text-teal-600 font-semibold text-sm">
                              {appt.doctorId?.specialization}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {new Date(
                                appt.appointmentDate,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {appt.startTime} - {appt.endTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span className="text-sm font-medium truncate">
                              {appt.clinicId?.clinicName}
                            </span>
                          </div>
                        </div>

                        {appt.symptoms && (
                          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs font-semibold text-amber-800 mb-1">
                              Symptoms
                            </p>
                            <p className="text-sm text-amber-900">
                              {appt.symptoms}
                            </p>
                          </div>
                        )}

                        {isExpanded && (
                          <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                            {appt.clinicId?.address && (
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">
                                    Clinic Address
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    {appt.clinicId.address},{" "}
                                    {appt.clinicId.city}
                                  </p>
                                </div>
                              </div>
                            )}

                            {appt.clinicId?.phone && (
                              <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">
                                    Contact
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    {appt.clinicId.phone}
                                  </p>
                                </div>
                              </div>
                            )}

                            {appt.diagnosis && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs font-semibold text-blue-800 mb-1">
                                  Diagnosis
                                </p>
                                <p className="text-sm text-blue-900">
                                  {appt.diagnosis}
                                </p>
                              </div>
                            )}

                            {appt.prescription?.length > 0 && (
                              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Pill className="w-4 h-4 text-purple-600" />
                                  <p className="text-xs font-semibold text-purple-800">
                                    Prescription ({appt.prescription.length}{" "}
                                    medicines)
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  {appt.prescription.map((med, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-white p-2 rounded border border-purple-100"
                                    >
                                      <p className="font-semibold text-gray-900 text-sm">
                                        {med.medicine}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {med.dosage} • {med.frequency} •{" "}
                                        {med.duration}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {appt.consultationNotes && (
                              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-xs font-semibold text-gray-800 mb-1">
                                  Consultation Notes
                                </p>
                                <p className="text-sm text-gray-700">
                                  {appt.consultationNotes}
                                </p>
                              </div>
                            )}

                            {appt.reports?.length > 0 && (
                              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                                <p className="text-xs font-semibold text-teal-800 mb-2">
                                  Medical Reports ({appt.reports.length})
                                </p>
                                <div className="space-y-2">
                                  {appt.reports.map((r, idx) => (
                                    <a
                                      key={idx}
                                      href={r.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 transition group"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="w-4 h-4 text-teal-600" />
                                        <span className="text-sm font-medium text-gray-900 truncate">
                                          {r.fileName}
                                        </span>
                                      </div>
                                      <Download className="w-4 h-4 text-teal-600 group-hover:scale-110 transition" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {appt.status === "cancelled" &&
                              appt.cancellationReason && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-xs font-semibold text-red-800 mb-1">
                                    Cancellation Reason
                                    {appt.cancelledBy &&
                                      ` (by ${appt.cancelledBy})`}
                                  </p>
                                  <p className="text-sm text-red-900">
                                    {appt.cancellationReason}
                                  </p>
                                </div>
                              )}
                          </div>
                        )}

                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() =>
                              setExpandedCard(isExpanded ? null : appt._id)
                            }
                            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                          >
                            {isExpanded ? "Show Less" : "View Details"}
                            <ChevronRight
                              className={`w-4 h-4 transition ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </button>

                          {appt.status !== "cancelled" &&
                            appt.status !== "completed" && (
                              <button
                                onClick={() =>
                                  handleCancelAppointment(appt._id)
                                }
                                className="px-6 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                              >
                                Cancel
                              </button>
                            )}

                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                            <span className="text-sm font-bold text-gray-900">
                              ₹{appt.amount}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                appt.paymentStatus === "paid"
                                  ? "bg-teal-100 text-teal-700"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {appt.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;
