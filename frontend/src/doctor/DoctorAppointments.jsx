import React, { useEffect, useState } from 'react';
import { useDoctorAppointmentStore } from '../store/doctorAppointmentStore';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Pill,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Loader,
  Search,
  Filter,
  Download,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

function DoctorAppointments() {
  const {
    appointments,
    getDoctorAppointments,
    completeAppointment,
    cancelAppointment,
    isLoading,
  } = useDoctorAppointmentStore();

  const [selectedTab, setSelectedTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [consultationData, setConsultationData] = useState({
    diagnosis: '',
    consultationNotes: '',
    prescription: [],
  });
  const [currentMedicine, setCurrentMedicine] = useState({
    medicine: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  useEffect(() => {
    getDoctorAppointments();
  }, []);

  const tabs = [
    { id: 'today', label: 'Today', filter: (a) => isToday(new Date(a.appointmentDate)) },
    { id: 'upcoming', label: 'Upcoming', filter: (a) => isFuture(new Date(a.appointmentDate)) },
    { id: 'pending', label: 'Pending', filter: (a) => a.status === 'pending' },
    { id: 'completed', label: 'Completed', filter: (a) => a.status === 'completed' },
    { id: 'all', label: 'All', filter: () => true },
  ];

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFuture = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const filteredAppointments = appointments.filter((appt) => {
    const selectedTabFilter = tabs.find((t) => t.id === selectedTab)?.filter;
    const matchesTab = selectedTabFilter ? selectedTabFilter(appt) : true;

    const matchesSearch =
      searchQuery === '' ||
      appt.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.userId?.phone?.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle,
        label: 'Confirmed',
      },
      completed: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: CheckCircle,
        label: 'Completed',
      },
      cancelled: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
        label: 'Cancelled',
      },
      pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: AlertCircle,
        label: 'Pending',
      },
    };
    return configs[status] || configs.pending;
  };

  const handleStartConsultation = (appointment) => {
    setSelectedAppointment(appointment);
    setConsultationData({
      diagnosis: appointment.diagnosis || '',
      consultationNotes: appointment.consultationNotes || '',
      prescription: appointment.prescription || [],
    });
    setShowConsultationModal(true);
  };

  const handleAddMedicine = () => {
    if (!currentMedicine.medicine || !currentMedicine.dosage) {
      toast.error('Medicine name and dosage are required');
      return;
    }

    setConsultationData({
      ...consultationData,
      prescription: [...consultationData.prescription, { ...currentMedicine }],
    });

    setCurrentMedicine({
      medicine: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    });
  };

  const handleRemoveMedicine = (index) => {
    setConsultationData({
      ...consultationData,
      prescription: consultationData.prescription.filter((_, i) => i !== index),
    });
  };

  const handleCompleteConsultation = async () => {
    if (!consultationData.diagnosis) {
      toast.error('Diagnosis is required');
      return;
    }

    try {
      await completeAppointment(selectedAppointment._id, consultationData);
      setShowConsultationModal(false);
      setSelectedAppointment(null);
      setConsultationData({
        diagnosis: '',
        consultationNotes: '',
        prescription: [],
      });
    } catch (error) {
      console.error('Complete consultation error:', error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      try {
        await cancelAppointment(appointmentId, reason);
      } catch (error) {
        console.error('Cancel error:', error);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your patient consultations</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const count = appointments.filter(tab.filter).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    selectedTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Appointments Found
            </h2>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search'
                : `No ${selectedTab} appointments`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => {
              const statusConfig = getStatusConfig(appt.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={appt._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={
                          appt.userId?.profilePicture ||
                          `https://ui-avatars.com/api/?name=${appt.userId?.name}&size=80&background=14b8a6&color=fff&bold=true`
                        }
                        alt={appt.userId?.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {appt.userId?.name}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              {appt.userId?.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {appt.userId.phone}
                                </div>
                              )}
                              {appt.userId?.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {appt.userId.email}
                                </div>
                              )}
                            </div>
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
                              {new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
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
                            <span className="text-sm font-semibold text-emerald-600">
                              ₹{appt.amount}
                            </span>
                          </div>
                        </div>

                        {appt.symptoms && (
                          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-amber-800 mb-1">
                                  Symptoms
                                </p>
                                <p className="text-sm text-amber-900">{appt.symptoms}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {appt.notes && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-800 mb-1">
                              Patient Notes
                            </p>
                            <p className="text-sm text-blue-900">{appt.notes}</p>
                          </div>
                        )}

                        {appt.reports?.length > 0 && (
                          <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
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
                                  <Eye className="w-4 h-4 text-teal-600" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {appt.diagnosis && (
                          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-xs font-semibold text-purple-800 mb-1">
                              Diagnosis
                            </p>
                            <p className="text-sm text-purple-900">{appt.diagnosis}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => handleStartConsultation(appt)}
                                className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2"
                              >
                                <Stethoscope className="w-4 h-4" />
                                {appt.diagnosis ? 'Edit Consultation' : 'Start Consultation'}
                              </button>

                              <button
                                onClick={() => handleCancelAppointment(appt._id)}
                                className="px-6 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {appt.status === 'completed' && (
                            <button
                              onClick={() => handleStartConsultation(appt)}
                              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showConsultationModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Consultation - {selectedAppointment.userId?.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedAppointment.appointmentDate).toLocaleDateString()} at{' '}
                      {selectedAppointment.startTime}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowConsultationModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {selectedAppointment.symptoms && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-semibold text-amber-800 mb-2">
                      Patient Symptoms
                    </p>
                    <p className="text-sm text-amber-900">{selectedAppointment.symptoms}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diagnosis *
                  </label>
                  <textarea
                    value={consultationData.diagnosis}
                    onChange={(e) =>
                      setConsultationData({ ...consultationData, diagnosis: e.target.value })
                    }
                    placeholder="Enter diagnosis..."
                    rows="3"
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    disabled={selectedAppointment.status === 'completed'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Consultation Notes
                  </label>
                  <textarea
                    value={consultationData.consultationNotes}
                    onChange={(e) =>
                      setConsultationData({
                        ...consultationData,
                        consultationNotes: e.target.value,
                      })
                    }
                    placeholder="Enter consultation notes..."
                    rows="4"
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    disabled={selectedAppointment.status === 'completed'}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Prescription
                    </label>
                  </div>

                  {selectedAppointment.status !== 'completed' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Medicine name *"
                          value={currentMedicine.medicine}
                          onChange={(e) =>
                            setCurrentMedicine({ ...currentMedicine, medicine: e.target.value })
                          }
                          className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g., 500mg) *"
                          value={currentMedicine.dosage}
                          onChange={(e) =>
                            setCurrentMedicine({ ...currentMedicine, dosage: e.target.value })
                          }
                          className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Frequency (e.g., Twice daily)"
                          value={currentMedicine.frequency}
                          onChange={(e) =>
                            setCurrentMedicine({ ...currentMedicine, frequency: e.target.value })
                          }
                          className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 7 days)"
                          value={currentMedicine.duration}
                          onChange={(e) =>
                            setCurrentMedicine({ ...currentMedicine, duration: e.target.value })
                          }
                          className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Instructions (e.g., Take after meals)"
                        value={currentMedicine.instructions}
                        onChange={(e) =>
                          setCurrentMedicine({ ...currentMedicine, instructions: e.target.value })
                        }
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-3"
                      />
                      <button
                        onClick={handleAddMedicine}
                        className="w-full bg-teal-100 text-teal-700 py-2 rounded-lg font-semibold hover:bg-teal-200 transition"
                      >
                        Add Medicine
                      </button>
                    </div>
                  )}

                  {consultationData.prescription.length > 0 && (
                    <div className="space-y-2">
                      {consultationData.prescription.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{med.medicine}</p>
                              <p className="text-sm text-gray-600">
                                {med.dosage} • {med.frequency} • {med.duration}
                              </p>
                              {med.instructions && (
                                <p className="text-sm text-gray-500 italic mt-1">
                                  {med.instructions}
                                </p>
                              )}
                            </div>
                            {selectedAppointment.status !== 'completed' && (
                              <button
                                onClick={() => handleRemoveMedicine(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedAppointment.status !== 'completed' && (
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setShowConsultationModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteConsultation}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete Consultation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;