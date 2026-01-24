import React, { useEffect, useState } from "react";
import { useAdminStore } from "../store/adminStore";
import {
  Search,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Loader,
  Award,
  Heart,
  Stethoscope,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
} from "lucide-react";

function Doctors() {
  const { doctors, fetchAllDoctors, isLoading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchAllDoctors();
  }, [fetchAllDoctors]);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.clinicId?.clinicName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && doctor.isActive) ||
      (filterStatus === "inactive" && !doctor.isActive);

    return matchesSearch && matchesStatus;
  });

  const activeDoctors = doctors.filter((d) => d.isActive).length;
  const totalSpecializations = [
    ...new Set(doctors.map((d) => d.specialization)),
  ].length;

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <Stethoscope className="w-10 h-10 text-purple-600" />
            All Doctors
          </h1>
          <p className="text-lg text-gray-600">
            Managing healthcare professionals across the network 🏥
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">
                  Total Doctors
                </p>
                <p className="text-4xl font-black">{doctors.length}</p>
              </div>
              <User className="w-12 h-12 opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold mb-1">
                  Active Doctors
                </p>
                <p className="text-4xl font-black">{activeDoctors}</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">
                  Specializations
                </p>
                <p className="text-4xl font-black">{totalSpecializations}</p>
              </div>
              <Award className="w-12 h-12 opacity-30" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-white border-b border-gray-100 px-6 py-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="Search name, specialization, or clinic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-black rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-500">Fetching medical staff...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-20">
                <Stethoscope className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">
                  No doctors found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row items-center gap-6"
                  >
                    <div className="relative flex-shrink-0">
                      {doctor.profilePicture ? (
                        <img
                          src={doctor.profilePicture}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-50"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-2xl">
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                      <div
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${doctor.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-900">
                          {doctor.name}
                      </h3>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1 text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                          <Award className="w-3.5 h-3.5" />{" "}
                          {doctor.specialization}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />{" "}
                          {doctor.clinicId?.clinicName || "Private Clinic"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />{" "}
                          {doctor.clinicId?.city}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:flex items-center gap-4 md:gap-8 w-full md:w-auto px-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                          Experience
                        </p>
                        <p className="text-gray-900 font-bold">
                          {doctor.experience} Yrs
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                          Fee
                        </p>
                        <p className="text-emerald-600 font-bold">
                          ₹{doctor.consultationFee}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleView(doctor)}
                      className="w-full md:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye className="w-4 h-4" /> View details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showViewModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="bg-gray-900 px-8 py-6 flex items-center justify-between text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-purple-400" /> Professional
                Profile
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="hover:rotate-90 transition-transform p-1"
              >
                <XCircle className="w-7 h-7" />
              </button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 items-center border-b pb-6 mb-6">
                <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-purple-50 shadow-lg">
                  {selectedDoctor.profilePicture ? (
                    <img
                      src={selectedDoctor.profilePicture}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center text-4xl font-bold text-purple-600">
                      {selectedDoctor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-3xl font-black text-gray-900">
                    Dr. {selectedDoctor.name}
                  </h4>
                  <p className="text-purple-600 font-bold text-lg">
                    {selectedDoctor.specialization}
                  </p>
                  <div className="mt-3 flex gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-bold">
                      {selectedDoctor.qualification}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-bold ${selectedDoctor.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {selectedDoctor.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Mail className="w-5 h-5 text-purple-500 mb-2" />
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Email Address
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {selectedDoctor.email}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Phone className="w-5 h-5 text-purple-500 mb-2" />
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Contact Number
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {selectedDoctor.phone}
                  </p>
                </div>
              </div>

              {selectedDoctor.clinicId && (
                <div className="p-6 rounded-3xl bg-blue-50/50 border-2 border-blue-100">
                  <h5 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5" /> Assigned Clinic
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-blue-700 font-medium">Name</span>
                      <span className="font-bold text-gray-900">
                        {selectedDoctor.clinicId.clinicName}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-blue-700 font-medium">City</span>
                      <span className="font-bold text-gray-900">
                        {selectedDoctor.clinicId.city}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-medium">
                        Clinic Contact
                      </span>
                      <span className="font-bold text-gray-900">
                        {selectedDoctor.clinicId.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
