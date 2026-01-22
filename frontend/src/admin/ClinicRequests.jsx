import { useEffect, useState } from "react";
import { useAdminStore } from "../store/adminStore.js";
import { Building2, Mail, Phone, MapPin, User, Calendar, CheckCircle, XCircle } from "lucide-react";

function ClinicRequests() {
  const { fetchPendingClinics, pendingClinics, approveClinic, rejectClinic, isLoading } =
    useAdminStore();
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingClinics();
  }, []);

  const handleApprove = async (clinicId) => {
    setActionLoading(clinicId);
    await approveClinic(clinicId);
    setActionLoading(null);
  };

  const handleReject = async (clinicId) => {
    setActionLoading(clinicId);
    await rejectClinic(clinicId);
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Clinic Registration Requests
          </h1>
          <p className="text-gray-600">
            Review and manage clinic registration requests
          </p>
        </div>

        {/* Requests Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Pending Approval</h2>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg
                  className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-600 font-semibold">
                  Loading requests...
                </p>
              </div>
            </div>
          ) : pendingClinics.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Pending Requests
              </h3>
              <p className="text-gray-600">
                All clinic registration requests have been processed
              </p>
            </div>
          ) : (
            /* Requests Grid */
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingClinics.map((clinic) => (
                  <div
                    key={clinic._id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Clinic Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                          {clinic.clinicName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {clinic.clinicName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {clinic.city}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </div>

                    {/* Clinic Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Owner:</strong> {clinic.ownerName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{clinic.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{clinic.phone}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{clinic.city}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(clinic.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleApprove(clinic._id)}
                        disabled={actionLoading === clinic._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === clinic._id ? (
                          <svg
                            className="animate-spin h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleReject(clinic._id)}
                        disabled={actionLoading === clinic._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === clinic._id ? (
                          <svg
                            className="animate-spin h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {!isLoading && pendingClinics.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900">
                  {pendingClinics.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClinicRequests;