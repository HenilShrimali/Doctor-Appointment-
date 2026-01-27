import React, { useEffect, useState } from "react";
import { useAppointmentStore } from "../store/appointmentStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Filter,
  Stethoscope,
  Clock,
  ChevronRight,
  X,
  Calendar,
  Heart,
  Loader,
  Building2,
} from "lucide-react";

function FindDoctors() {
  const { getAvailableDoctors, doctors, isLoading } = useAppointmentStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    specialization: searchParams.get("specialization") || "",
    clinicName: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = {};
    if (filters.city) params.city = filters.city;
    if (filters.specialization) params.specialization = filters.specialization;

    getAvailableDoctors(params);
  }, [filters.city, filters.specialization]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.city) params.city = filters.city;
    if (filters.specialization) params.specialization = filters.specialization;
    getAvailableDoctors(params);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      specialization: "",
      clinicName: "",
    });
  };

 const specializations = [
   "General Physician",
   "Internal Medicine",
   "Family Medicine",
   "Cardiology",
   "Neurology",
   "Orthopedics",
   "Dermatology",
   "Pediatrics",
   "Gynecology",
   "Psychiatry",
   "ENT (Otolaryngology)",
   "Ophthalmology",
   "Pulmonology",
   "Gastroenterology",
   "Nephrology",
   "Endocrinology",
   "Rheumatology",
   "Oncology",
   "Urology",
   "Andrology",
   "General Surgery",
   "Neurosurgery",
   "Cardiothoracic Surgery",
   "Plastic Surgery",
   "Vascular Surgery",
   "Laparoscopic Surgery",
   "Radiology",
   "Pathology",
   "Anesthesiology",
   "Nuclear Medicine",
   "Obstetrics",
   "Reproductive Medicine",
   "Neonatology",
   "Clinical Psychology",
   "Physiotherapy",
   "Sports Medicine",
   "Rehabilitation Medicine",
   "Dentistry",
   "Orthodontics",
   "Endodontics",
   "Periodontics",
   "Oral & Maxillofacial Surgery",
   "Ayurveda",
   "Homeopathy",
   "Unani",
   "Naturopathy",
 ];


  const filteredDoctors = doctors.filter((doctor) => {
    let matches = true;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      matches =
        matches &&
        (doctor.name.toLowerCase().includes(searchLower) ||
          doctor.specialization.toLowerCase().includes(searchLower));
    }

    if (filters.clinicName) {
      const clinicLower = filters.clinicName.toLowerCase();
      matches =
        matches &&
        doctor.clinicId?.clinicName?.toLowerCase().includes(clinicLower);
    }

    return matches;
  });

  const handleBookAppointment = (doctor) => {
    navigate(`/book-appointment/${doctor._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Find Doctors
          </h1>
          <p className="text-gray-600">
            Search and book appointments with top doctors
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor name or specialty..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={filters.city}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    value={filters.specialization}
                    onChange={(e) =>
                      setFilters({ ...filters, specialization: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Clinic/Hospital
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter clinic name"
                      value={filters.clinicName}
                      onChange={(e) =>
                        setFilters({ ...filters, clinicName: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {(filters.city ||
                  filters.specialization ||
                  filters.clinicName) && (
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {(filters.city ||
          filters.specialization ||
          filters.clinicName ||
          filters.search) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.search && (
              <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-2">
                Search: {filters.search}
                <button onClick={() => setFilters({ ...filters, search: "" })}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {filters.city && (
              <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-2">
                City: {filters.city}
                <button onClick={() => setFilters({ ...filters, city: "" })}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {filters.specialization && (
              <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-2">
                {filters.specialization}
                <button
                  onClick={() => setFilters({ ...filters, specialization: "" })}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {filters.clinicName && (
              <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-2">
                Clinic: {filters.clinicName}
                <button
                  onClick={() => setFilters({ ...filters, clinicName: "" })}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
            <div className="flex flex-col items-center justify-center">
              <Loader className="w-12 h-12 text-teal-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Doctors Found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find more doctors
            </p>
            <button
              onClick={clearFilters}
              className="text-teal-600 font-semibold hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Found{" "}
                <span className="font-semibold text-gray-900">
                  {filteredDoctors.length}
                </span>{" "}
                doctors
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={
                        doctor.profilePicture ||
                        `https://ui-avatars.com/api/?name=${doctor.name}&size=120&background=14b8a6&color=fff&bold=true`
                      }
                      alt={doctor.name}
                      className="w-32 h-32 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                               {doctor.name}
                          </h3>
                          <p className="text-teal-600 font-semibold mb-2">
                            {doctor.specialization}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">
                            ₹{doctor.consultationFee}
                          </div>
                          <p className="text-sm text-gray-600">Consultation</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {doctor.experience} years exp
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">
                            {doctor.clinicId?.clinicName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {doctor.clinicId?.city}
                          </span>
                        </div>
                      </div>

                      {doctor.qualification && (
                        <p className="text-sm text-gray-600 mb-4">
                          <span className="font-semibold">Qualification:</span>{" "}
                          {doctor.qualification}
                        </p>
                      )}

                      {doctor.bio && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                          {doctor.bio}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleBookAppointment(doctor)}
                          className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-5 h-5" />
                          Book Appointment
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/doctor-profile/${doctor._id}`)
                          }
                          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                        >
                          View Profile
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default FindDoctors;
