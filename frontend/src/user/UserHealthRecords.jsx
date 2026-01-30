import React, { useEffect, useState } from "react";
import { useHealthRecordStore } from "../store/userHealthRecordStore.js";
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Plus,
  Search,
  X,
  Loader,
  Calendar,
  File,
  Image as ImageIcon,
  Eye,
  Edit2,
  Check,
} from "lucide-react";

function UserHealthRecords() {
  const {
    records,
    isLoading,
    isUploading,
    isDeleting,
    getUserHealthRecords,
    uploadHealthRecord,
    deleteHealthRecord,
    deleteFileFromRecord,
    updateHealthRecord,
    addFilesToRecord,
  } = useHealthRecordStore();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [recordTitle, setRecordTitle] = useState("");
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [viewingRecord, setViewingRecord] = useState(null);

  useEffect(() => {
    getUserHealthRecords();
  }, []);

  useEffect(() => {
    getUserHealthRecords(searchQuery);
  }, [searchQuery]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type === "application/pdf" || file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });
    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!recordTitle.trim()) {
      alert("Please enter a title");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Please select at least one file");
      return;
    }

    try {
      await uploadHealthRecord(recordTitle, selectedFiles);
      setShowUploadModal(false);
      setRecordTitle("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this health record?")) {
      try {
        await deleteHealthRecord(id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleDeleteFile = async (recordId, fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteFileFromRecord(recordId, fileId);
      } catch (error) {
        console.error("Delete file error:", error);
      }
    }
  };

  const handleEditTitle = async (id) => {
    if (!editTitle.trim()) {
      return;
    }

    try {
      await updateHealthRecord(id, editTitle);
      setEditingRecordId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith("image/"))
      return <ImageIcon className="w-5 h-5" />;
    if (fileType === "application/pdf") return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Health Records
          </h1>
          <p className="text-gray-600">
            Manage your medical documents and reports
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search health records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Records
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
            <div className="flex flex-col items-center justify-center">
              <Loader className="w-12 h-12 text-teal-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading health records...</p>
            </div>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Health Records
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your medical documents to keep them safe and organized
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-teal-600 font-semibold hover:underline"
            >
              Upload Your First Record
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record) => (
              <div
                key={record._id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  {editingRecordId === record._id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditTitle(record._id)}
                        className="text-teal-600 hover:text-teal-700"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRecordId(null);
                          setEditTitle("");
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-gray-900 flex-1">
                        {record.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingRecordId(record._id);
                            setEditTitle(record.title);
                          }}
                          className="text-gray-400 hover:text-teal-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-gray-400 hover:text-red-600"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="space-y-2 mb-4">
                  {record.files.slice(0, 3).map((file) => (
                    <div
                      key={file._id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="text-teal-600">
                          {getFileIcon(file.fileType)}
                        </div>
                        <span className="text-sm text-gray-700 truncate">
                          {file.fileName}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-teal-600"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={file.fileUrl}
                          download
                          className="text-gray-400 hover:text-teal-600"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(record._id, file._id)}
                          className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {record.files.length > 3 && (
                    <button
                      onClick={() => setViewingRecord(record)}
                      className="text-sm text-teal-600 hover:underline"
                    >
                      +{record.files.length - 3} more files
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setViewingRecord(record)}
                  className="w-full py-2 border bg-teal-600 border-gray-300 rounded-lg text-sm font-semibold text-white hover:bg-teal-700 transition"
                >
                  View All Files ({record.files.length})
                </button>
              </div>
            ))}
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Upload Health Records
                  </h2>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setRecordTitle("");
                      setSelectedFiles([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Record Title *
                  </label>
                  <input
                    type="text"
                    value={recordTitle}
                    onChange={(e) => setRecordTitle(e.target.value)}
                    placeholder="e.g., Blood Test Results, X-Ray Report"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Files *
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-teal-500 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF or Images (Max 10MB each)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Selected Files ({selectedFiles.length})
                    </p>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="text-teal-600">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setRecordTitle("");
                    setSelectedFiles([]);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {viewingRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {viewingRecord.title}
                  </h2>
                  <button
                    onClick={() => setViewingRecord(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingRecord.files.map((file) => (
                    <div
                      key={file._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-teal-500 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="text-teal-600">
                            {getFileIcon(file.fileType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {file.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.fileSize)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-teal-50 text-teal-600 rounded-lg text-sm font-semibold hover:bg-teal-100 transition flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                        <a
                          href={file.fileUrl}
                          download
                          className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <button
                          onClick={() =>
                            handleDeleteFile(viewingRecord._id, file._id)
                          }
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHealthRecords;
