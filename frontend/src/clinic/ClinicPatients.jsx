import React, { useEffect, useState } from "react";
import { useClinicPatientStore } from "../store/clinicPatientStore";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Search,
  Loader,
  Eye,
  X,
  Stethoscope,
  FileText,
  Pill,
  Download,
  Activity,
  Droplet,
  Users,
  TrendingUp,
} from "lucide-react";

function ClinicPatients() {
  const { patients, getPatients, getPatientHistory, isLoading } =
    useClinicPatientStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    getPatients();
  }, []);

  const handleViewPatient = async (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
    setLoadingHistory(true);
    try {
      const history = await getPatientHistory(patient._id);
      setPatientHistory(history);
    } catch (error) {
      console.error("Error fetching patient history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(search) ||
      patient.phone?.includes(search) ||
      patient.email?.toLowerCase().includes(search) ||
      patient.city?.toLowerCase().includes(search)
    );
  });

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Phone",
      "Email",
      "City",
      "Blood Group",
      "Total Visits",
    ];
    const rows = filteredPatients.map((patient) => [
      patient.name,
      patient.phone || "N/A",
      patient.email || "N/A",
      patient.city || "N/A",
      patient.bloodGroup || "N/A",
      patient.totalAppointments || 0,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading && patients.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Clinic Patients
          </h1>
          <p className="text-gray-600">
            View all patients who have visited your clinic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Patients
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {patients.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Active Patients
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {patients.filter((p) => p.totalAppointments > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Visits
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {patients.reduce(
                    (sum, p) => sum + (p.totalAppointments || 0),
                    0,
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Avg Visits/Patient
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {patients.length > 0
                    ? (
                        patients.reduce(
                          (sum, p) => sum + (p.totalAppointments || 0),
                          0,
                        ) / patients.length
                      ).toFixed(1)
                    : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, email, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={exportToCSV}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <strong>{filteredPatients.length}</strong> of{" "}
            <strong>{patients.length}</strong> patients
          </p>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? "No patients found" : "No Patients Yet"}
            </h2>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search"
                : "Patients will appear here after consultations"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
                onClick={() => handleViewPatient(patient)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={
                        patient.profilePicture ||
                        `https://ui-avatars.com/api/?name=${patient.name}&size=80&background=14b8a6&color=fff&bold=true`
                      }
                      alt={patient.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {patient.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="w-4 h-4" />
                        <span>
                          {patient.dateOfBirth
                            ? `${calculateAge(patient.dateOfBirth)} years`
                            : "Age N/A"}
                        </span>
                      </div>
                      {patient.bloodGroup && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Droplet className="w-4 h-4" />
                          <span>{patient.bloodGroup}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {patient.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="truncate">{patient.phone}</span>
                      </div>
                    )}
                    {patient.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                    )}
                    {patient.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{patient.city}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">
                        {patient.totalAppointments || 0}
                      </span>{" "}
                      {patient.totalAppointments === 1 ? "visit" : "visits"}
                    </div>
                    <div className="flex items-center gap-1 text-teal-600 text-sm font-semibold">
                      View History
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetailsModal && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        selectedPatient.profilePicture ||
                        `https://ui-avatars.com/api/?name=${selectedPatient.name}&size=80&background=14b8a6&color=fff&bold=true`
                      }
                      alt={selectedPatient.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedPatient.name}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        {selectedPatient.dateOfBirth && (
                          <span>
                            {calculateAge(selectedPatient.dateOfBirth)} years
                          </span>
                        )}
                        {selectedPatient.bloodGroup && (
                          <span className="flex items-center gap-1">
                            <Droplet className="w-4 h-4" />
                            {selectedPatient.bloodGroup}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedPatient(null);
                      setPatientHistory([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      {selectedPatient.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {selectedPatient.phone}
                          </span>
                        </div>
                      )}
                      {selectedPatient.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {selectedPatient.email}
                          </span>
                        </div>
                      )}
                      {selectedPatient.city && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {selectedPatient.city}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Medical Information
                    </h3>
                    <div className="space-y-2">
                      {selectedPatient.dateOfBirth && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            DOB:{" "}
                            {new Date(
                              selectedPatient.dateOfBirth,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {selectedPatient.bloodGroup && (
                        <div className="flex items-center gap-2 text-sm">
                          <Droplet className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            Blood Group: {selectedPatient.bloodGroup}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {patientHistory.length} total consultations at this
                          clinic
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Consultation History at This Clinic
                  </h3>

                  {loadingHistory ? (
                    <div className="flex justify-center py-8">
                      <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                  ) : patientHistory.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No consultation history</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {patientHistory.map((appointment) => (
                        <div
                          key={appointment._id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-teal-600" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {new Date(
                                    appointment.appointmentDate,
                                  ).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.startTime} -{" "}
                                  {appointment.endTime} • Dr.{" "}
                                  {appointment.doctorId?.name}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                appointment.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : appointment.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>

                          {appointment.symptoms && (
                            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-xs font-semibold text-amber-800 mb-1">
                                Symptoms
                              </p>
                              <p className="text-sm text-amber-900">
                                {appointment.symptoms}
                              </p>
                            </div>
                          )}

                          {appointment.diagnosis && (
                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs font-semibold text-blue-800 mb-1">
                                Diagnosis
                              </p>
                              <p className="text-sm text-blue-900">
                                {appointment.diagnosis}
                              </p>
                            </div>
                          )}

                          {appointment.prescription?.length > 0 && (
                            <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Pill className="w-4 h-4 text-purple-600" />
                                <p className="text-xs font-semibold text-purple-800">
                                  Prescription (
                                  {appointment.prescription.length} medicines)
                                </p>
                              </div>
                              <div className="space-y-2">
                                {appointment.prescription.map((med, idx) => (
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

                          {appointment.consultationNotes && (
                            <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <p className="text-xs font-semibold text-gray-800 mb-1">
                                Notes
                              </p>
                              <p className="text-sm text-gray-700">
                                {appointment.consultationNotes}
                              </p>
                            </div>
                          )}

                          {appointment.reports?.length > 0 && (
                            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                              <p className="text-xs font-semibold text-teal-800 mb-2">
                                Reports ({appointment.reports.length})
                              </p>
                              <div className="space-y-2">
                                {appointment.reports.map((r, idx) => (
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClinicPatients;
