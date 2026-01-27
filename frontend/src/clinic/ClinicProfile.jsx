import React, { useState } from "react";
import { useClinicAuthStore } from "../store/clinicAuthStore";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Camera,
  Save,
  Edit,
  X,
  CheckCircle,
} from "lucide-react";

function ClinicProfile() {
  const {
    clinic,
    updateClinicProfile,
    updateClinicProfilePicture,
    isUpdatingProfile,
  } = useClinicAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: clinic?.clinicName || "",
    ownerName: clinic?.ownerName || "",
    email: clinic?.email || "",
    phone: clinic?.phone || "",
    city: clinic?.city || "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateClinicProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      clinicName: clinic?.clinicName || "",
      ownerName: clinic?.ownerName || "",
      email: clinic?.email || "",
      phone: clinic?.phone || "",
      city: clinic?.city || "",
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        await updateClinicProfilePicture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Clinic Profile
          </h1>
          <p className="text-gray-600">
            View and manage your clinic information
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  {clinic?.profilePicture ? (
                    <img
                      src={clinic.profilePicture}
                      alt="Clinic"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                <label
                  htmlFor="profile-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center md:text-left text-white flex-1">
                <h2 className="text-3xl font-bold mb-1">
                  {clinic?.clinicName}
                </h2>
                <p className="text-blue-100 mb-2">{clinic?.city}</p>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  {clinic?.status === "approved" ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Approved
                    </span>
                  ) : clinic?.status === "pending" ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                      <Clock className="w-4 h-4" />
                      Pending Approval
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                      <X className="w-4 h-4" />
                      Rejected
                    </span>
                  )}
                  {clinic?.isActive && (
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-semibold">
                      Active
                    </span>
                  )}
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="clinicName"
                        value={formData.clinicName}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdatingProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">
                        Clinic Name
                      </label>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {clinic?.clinicName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">
                        Owner Name
                      </label>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {clinic?.ownerName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">
                        Email
                      </label>
                    </div>
                    <p className="text-gray-900 font-medium">{clinic?.email}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">
                        Phone
                      </label>
                    </div>
                    <p className="text-gray-900 font-medium">{clinic?.phone}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">
                        City
                      </label>
                    </div>
                    <p className="text-gray-900 font-medium">{clinic?.city}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Account Status:</span>
                      <span className="ml-2 font-semibold text-blue-900">
                        {clinic?.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Approval Status:</span>
                      <span className="ml-2 font-semibold text-blue-900 capitalize">
                        {clinic?.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Role:</span>
                      <span className="ml-2 font-semibold text-blue-900 capitalize">
                        {clinic?.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Joined:</span>
                      <span className="ml-2 font-semibold text-blue-900">
                        {new Date(clinic?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-600 text-center">
            <strong>Note:</strong> Profile picture changes are instant. Other
            changes require saving.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClinicProfile;
