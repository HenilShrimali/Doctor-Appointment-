import React, { useState, useEffect } from 'react';
import { useClinicDoctorStore } from '../store/clinicDoctorStore';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  X,
  User,
  Phone,
  Briefcase,
  GraduationCap,
  DollarSign,
  Camera,
  Loader,
  CheckCircle,
  Heart,
  Award,
  Mail,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

function ClinicDoctors() {
  const { 
    doctors, 
    getDoctors, 
    addDoctor, 
    updateDoctor,
    toggleDoctorStatus,
    isLoading, 
    isAddingDoctor,
    isUpdatingDoctor 
  } = useClinicDoctorStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    qualification: '',
    experience: '',
    phone: '',
    consultationFee: '',
    profilePicture: '',
    bio: ''
  });

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image should be less than 5MB 📸');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoctor(formData);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: '',
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      phone: doctor.phone,
      consultationFee: doctor.consultationFee,
      profilePicture: doctor.profilePicture || '',
      bio: doctor.bio || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = { ...formData };
    if (!updateData.password) {
      delete updateData.password;
    }
    await updateDoctor(selectedDoctor._id, updateData);
    setShowEditModal(false);
    resetForm();
  };

  const handleToggleStatus = async (id) => {
    await toggleDoctorStatus(id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      specialization: '',
      qualification: '',
      experience: '',
      phone: '',
      consultationFee: '',
      profilePicture: '',
      bio: ''
    });
    setSelectedDoctor(null);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDoctors = doctors.filter(d => d.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            Your Healthcare Team
          </h1>
          <p className="text-lg text-gray-600">Manage the doctors</p>
        </div>

        {/* Friendly Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">
                  Total Doctors
                </p>
                <p className="text-4xl font-black">{doctors.length}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Building a great team!
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold mb-1">
                  Active Doctors
                </p>
                <p className="text-4xl font-black">{activeDoctors}</p>
                <p className="text-emerald-100 text-xs mt-1">Ready to help!</p>
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
                  Specializations
                </p>
                <p className="text-4xl font-black">
                  {[...new Set(doctors.map((d) => d.specialization))].length}
                </p>
                <p className="text-purple-100 text-xs mt-1">
                  Diverse expertise!
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6" />
                Doctor Directory
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 sm:min-w-[300px]">
                  <input
                    type="text"
                    placeholder="Search by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/30 transition-all text-lg"
                  />
                  <Search className="w-5 h-5 text-white/70 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Doctor</span>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <p className="text-xl text-gray-600 font-semibold">
                Loading Doctors... 🏥
              </p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <User className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm
                  ? "No doctors found"
                  : "Build Your Healthcare Team!"}
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                {searchTerm
                  ? "Try adjusting your search to find the doctor you're looking for "
                  : "Add your first doctor"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Doctor
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {doctor.profilePicture ? (
                            <img
                              src={doctor.profilePicture}
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl ring-4 ring-blue-100">
                              {doctor.name.charAt(0)}
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Heart className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-blue-600 font-semibold">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(doctor._id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          doctor.isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {doctor.isActive ? "✓ Active" : "✕ Inactive"}
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {doctor.qualification}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                        <span>
                          {doctor.experience} years of caring for patients
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>{doctor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-emerald-600">
                          ₹{doctor.consultationFee}
                        </span>
                      </div>
                    </div>

                    {doctor.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">
                        "{doctor.bio}"
                      </p>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(doctor._id)}
                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition text-sm font-semibold
                              ${
                       doctor.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }
    `               }
                      >
                        {doctor.isActive ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Activate
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
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Add a New Doctor
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-white hover:bg-white/20 p-2 rounded-xl transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 text-black">
              {/* Profile Picture Upload */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center overflow-hidden">
                    {formData.profilePicture ? (
                      <img
                        src={formData.profilePicture}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Doctor's Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    placeholder="Dr. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    placeholder="doctor@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    placeholder="Min. 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    placeholder="+91 1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    placeholder="e.g., Cardiologist"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    placeholder="e.g., MBBS, MD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience (years) *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio (Tell patients about this doctor's expertise and approach)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none text-lg"
                  placeholder="Dr. Sarah loves helping families stay healthy and happy..."
                />
              </div>

              <button
                type="submit"
                disabled={isAddingDoctor}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] duration-200"
              >
                {isAddingDoctor ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Adding Doctor...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Add Doctor to Team
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedDoctor && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Edit className="w-6 h-6" />
          Update Doctor Details
        </h3>
        <button
          onClick={() => {
            setShowEditModal(false);
            resetForm();
          }}
          className="text-white hover:bg-white/20 p-2 rounded-xl transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleUpdate} className="p-8 space-y-6 text-black">
        {/* Current Doctor Info Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
          <p className="text-sm text-purple-900">
            <strong className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Updating: {selectedDoctor.name}
            </strong>
          </p>
          <p className="text-xs text-purple-700 mt-1">
            {selectedDoctor.specialization} • Joined{" "}
            {new Date(selectedDoctor.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center overflow-hidden ring-4 ring-purple-200">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-4xl">
                  {formData.name?.charAt(0) || "D"}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-purple-50 transition ring-2 ring-purple-200">
              <Camera className="w-5 h-5 text-purple-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600" />
              Doctor's Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
              placeholder="Dr. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
              placeholder="doctor@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password (Leave blank to keep current password)
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                minLength="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg pr-32"
                placeholder="Enter new password (min. 6 chars)"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white px-2">
                Optional
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-600" />
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
              placeholder="+91 1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Specialization *
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
              placeholder="e.g., Cardiologist"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              Qualification *
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
              placeholder="e.g., MBBS, MD"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              Experience (years) *
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Consultation Fee (₹) *
            </label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
              placeholder="500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-purple-600" />
            Bio (Tell patients about this doctor's expertise and approach)
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none text-lg"
            placeholder="Dr. Sarah loves helping families stay healthy and happy..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isUpdatingDoctor}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] duration-200"
          >
            {isUpdatingDoctor ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Updating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Save Changes 
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowEditModal(false);
              resetForm();
            }}
            disabled={isUpdatingDoctor}
            className="px-8 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );  
}

export default ClinicDoctors;