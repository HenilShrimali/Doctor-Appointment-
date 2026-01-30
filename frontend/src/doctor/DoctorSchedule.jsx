import React, { useState, useEffect } from "react";
import { useDoctorScheduleStore } from "../store/doctorScheduleStore";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
  XCircle,
  Activity,
  AlertCircle,
} from "lucide-react";

function DoctorSchedule() {
  const {
    timeSlots,
    isLoading,
    isCreating,
    getTimeSlots,
    createBulkTimeSlots,
    deleteTimeSlot,
    deleteBulkTimeSlots,
    updateTimeSlot,
  } = useDoctorScheduleStore();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFormData, setBulkFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    slotDuration: 30,
    bufferTime: 5,
  });

  useEffect(() => {
    getTimeSlots({ date: selectedDate });
  }, [getTimeSlots, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleBulkInputChange = (e) => {
    setBulkFormData({
      ...bulkFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBulkCreate = async (e) => {
    e.preventDefault();

    try {
      await createBulkTimeSlots(bulkFormData);
      setShowBulkModal(false);
      setBulkFormData({
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        slotDuration: 30,
        bufferTime: 5,
      });
    } catch (error) {
      console.error(" Error in handleBulkCreate:", error);
    }
  };

  const handleToggleAvailability = async (slot) => {
    try {
      await updateTimeSlot(slot._id, { isAvailable: !slot.isAvailable });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      try {
        await deleteTimeSlot(slotId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteAllSlots = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete all unbooked slots for ${selectedDate}?`,
      )
    ) {
      try {
        await deleteBulkTimeSlots(selectedDate);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const slotsByDate = timeSlots.reduce((acc, slot) => {
    const date = new Date(slot.date).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const selectedDateSlots = slotsByDate[selectedDate] || [];

  // Calculate stats for SELECTED DATE ONLY
  const totalSlotsForDate = selectedDateSlots.length;
  const availableSlotsForDate = selectedDateSlots.filter(
    (s) => s.isAvailable && !s.isBooked,
  ).length;
  const bookedSlotsForDate = selectedDateSlots.filter((s) => s.isBooked).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Schedule</h1>
          <p className="text-gray-600">
            Manage your availability and time slots
          </p>
        </div>

        {/* Stats for SELECTED DATE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Slots
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalSlotsForDate}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Available
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {availableSlotsForDate}
                </p>
                <p className="text-xs text-gray-500 mt-1">Open slots</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Booked</p>
                <p className="text-3xl font-bold text-purple-600">
                  {bookedSlotsForDate}
                </p>
                <p className="text-xs text-gray-500 mt-1">Appointments</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-emerald-600 px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-teal-100 text-sm font-semibold mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="px-4 py-2 rounded-lg border border-teal-400 bg-emerald-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                  />
                </div>
                <div className="mt-6">
                  <p className="text-white text-sm">
                    <strong>{totalSlotsForDate}</strong> slots •
                    <strong className="text-emerald-200">
                      {" "}
                      {availableSlotsForDate}
                    </strong>{" "}
                    available •
                    <strong className="text-purple-200">
                      {" "}
                      {bookedSlotsForDate}
                    </strong>{" "}
                    booked
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="flex items-center gap-2 bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-teal-50 transition shadow"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Slots</span>
                </button>
                {totalSlotsForDate > 0 && (
                  <button
                    onClick={handleDeleteAllSlots}
                    className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition shadow"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Clear Day</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-12 h-12 text-teal-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading schedule...</p>
              </div>
            ) : selectedDateSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No slots for {new Date(selectedDate).toLocaleDateString()}
                </h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Create time slots to let patients book appointments with you
                </p>
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Time Slots
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {selectedDateSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      slot.isBooked
                        ? "bg-purple-50 border-purple-300"
                        : slot.isAvailable
                          ? "bg-emerald-50 border-emerald-300 hover:shadow-md"
                          : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    <div className="absolute -top-2 -right-2">
                      {slot.isBooked ? (
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : slot.isAvailable ? (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <EyeOff className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        Time
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {slot.startTime}
                      </p>
                      <p className="text-xs text-gray-500">{slot.endTime}</p>
                    </div>

                    <div className="mb-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold ${
                          slot.isBooked
                            ? "bg-purple-200 text-purple-700"
                            : slot.isAvailable
                              ? "bg-emerald-200 text-emerald-700"
                              : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {slot.isBooked
                          ? "Booked"
                          : slot.isAvailable
                            ? "Available"
                            : "Unavailable"}
                      </span>
                    </div>

                    {!slot.isBooked && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleAvailability(slot)}
                          className="flex-1 p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition text-xs font-semibold"
                          title={
                            slot.isAvailable
                              ? "Mark Unavailable"
                              : "Mark Available"
                          }
                        >
                          {slot.isAvailable ? (
                            <EyeOff className="w-3.5 h-3.5 mx-auto" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 mx-auto" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot._id)}
                          className="flex-1 p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition text-xs font-semibold"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-teal-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Create Time Slots
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form
              id="bulk-slot-form"
              onSubmit={handleBulkCreate}
              className="flex-1 overflow-y-auto text-black"
            >
              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <strong>Tip:</strong> Create multiple slots at once for a
                    specific day!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bulkFormData.date}
                    onChange={handleBulkInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <select
                      name="startTime"
                      value={bulkFormData.startTime}
                      onChange={handleBulkInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {generateTimeOptions().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time *
                    </label>
                    <select
                      name="endTime"
                      value={bulkFormData.endTime}
                      onChange={handleBulkInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {generateTimeOptions().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slot Duration (minutes) *
                  </label>
                  <select
                    name="slotDuration"
                    value={bulkFormData.slotDuration}
                    onChange={handleBulkInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Buffer Time Between Slots (minutes)
                  </label>
                  <select
                    name="bufferTime"
                    value={bulkFormData.bufferTime}
                    onChange={handleBulkInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value={0}>No buffer (back-to-back)</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Buffer time is break time between appointments
                  </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <p className="text-sm text-teal-900">
                    <strong>Preview:</strong> Slots from{" "}
                    <strong>{bulkFormData.startTime}</strong> to{" "}
                    <strong>{bulkFormData.endTime}</strong> with{" "}
                    <strong>{bulkFormData.slotDuration} min</strong>{" "}
                    appointments
                    {bulkFormData.bufferTime > 0 && (
                      <span>
                        {" "}
                        + <strong>{bulkFormData.bufferTime} min</strong> buffer
                      </span>
                    )}{" "}
                    on{" "}
                    <strong>
                      {new Date(bulkFormData.date).toLocaleDateString()}
                    </strong>
                  </p>
                </div>
              </div>
            </form>

            <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 bg-gray-50">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  disabled={isCreating}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="bulk-slot-form"
                  disabled={isCreating}
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {isCreating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Create Slots
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateTimeOptions() {
  const times = [];

  for (let hour = 0; hour < 12; hour++) {
    const displayHour = hour === 0 ? 12 : hour;
    for (let minute of ["00", "15", "30", "45"]) {
      times.push(`${displayHour.toString().padStart(2, "0")}:${minute} AM`);
    }
  }

  for (let hour = 0; hour < 12; hour++) {
    const displayHour = hour === 0 ? 12 : hour;
    for (let minute of ["00", "15", "30", "45"]) {
      times.push(`${displayHour.toString().padStart(2, "0")}:${minute} PM`);
    }
  }

  return times;
}

export default DoctorSchedule;
