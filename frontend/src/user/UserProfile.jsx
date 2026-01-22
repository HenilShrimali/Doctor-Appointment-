import React, { useState, useRef } from "react";
import { useUserAuthStore } from "../store/userAuthStore";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  Camera,
  Edit2,
  Save,
  X,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UserProfile() {
  const navigate = useNavigate();
  const { user, updateUserProfile, updateUserProfilePicture } =
    useUserAuthStore();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    city: user?.city || "",
    bloodGroup: user?.bloodGroup || "Unknown",
  });

  const bloodGroups = [
    "O+",
    "O-",
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "Unknown",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      city: user?.city || "",
      bloodGroup: user?.bloodGroup || "Unknown",
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        await updateUserProfilePicture(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Error reading file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      console.error("Image upload error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-sm bg-white/40 border-b border-white/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl hover:bg-white/60 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  My Profile
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  Manage your personal information
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8 sm:mb-10">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-xl overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4 text-center">
              {user?.name}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              {user?.email}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full bg-white border-2 rounded-xl py-3 pl-11 pr-4 text-slate-900 transition-all ${
                    isEditing
                      ? "border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      : "border-slate-200 cursor-not-allowed bg-gray-50"
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full bg-white border-2 rounded-xl py-3 pl-11 pr-4 text-slate-900 transition-all ${
                    isEditing
                      ? "border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      : "border-slate-200 cursor-not-allowed bg-gray-50"
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full bg-white border-2 rounded-xl py-3 pl-11 pr-4 text-slate-900 transition-all ${
                    isEditing
                      ? "border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      : "border-slate-200 cursor-not-allowed bg-gray-50"
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Date of Birth and City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-white border-2 rounded-xl py-3 pl-11 pr-4 text-slate-900 transition-all ${
                      isEditing
                        ? "border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        : "border-slate-200 cursor-not-allowed bg-gray-50"
                    } focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-white border-2 rounded-xl py-3 pl-11 pr-4 text-slate-900 transition-all ${
                      isEditing
                        ? "border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        : "border-slate-200 cursor-not-allowed bg-gray-50"
                    } focus:outline-none`}
                  />
                </div>
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Blood Group
              </label>
              <div className="relative">
                <Droplet className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full bg-white border-2 rounded-xl py-3 pl-11 pr-4 text-slate-900 transition-all ${
                    isEditing
                      ? "border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      : "border-slate-200 cursor-not-allowed bg-gray-50"
                  } focus:outline-none`}
                >
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Account Information */}
          {!isEditing && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-teal-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-1">Account Status</p>
                  <p className="font-semibold text-slate-900">
                    {user?.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </p>
                </div>
                <div className="bg-teal-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-1">Member Since</p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
