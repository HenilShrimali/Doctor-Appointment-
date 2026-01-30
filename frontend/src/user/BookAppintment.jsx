import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppointmentStore } from '../store/appointmentStore';
import { usePaymentStore } from '../store/paymentStore';
import { useUserAuthStore } from '../store/userAuthStore';
import {
  Calendar,
  Clock,
  FileText,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  CreditCard,
  Stethoscope,
  Building2,
  ArrowLeft,
} from 'lucide-react';

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserAuthStore();
  const { getDoctorAvailableSlots, availableSlots, isLoading, createAppointment, uploadReports } = useAppointmentStore();
  const { initializeRazorpay, createOrder, processPayment } = usePaymentStore();

  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate || new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState(location.state?.slot || null);
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  
  const [formData, setFormData] = useState({
    symptoms: '',
    notes: '',
  });

  const [reportFiles, setReportFiles] = useState([]);
  const [uploadedReports, setUploadedReports] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (doctorId && selectedDate) {
      getDoctorAvailableSlots(doctorId, selectedDate);
    }
  }, [doctorId, selectedDate]);

  useEffect(() => {
    if (!doctor && doctorId) {
      const fetchDoctor = async () => {
        try {
          const response = await fetch(`/api/appointment/doctors`);
          const data = await response.json();
          const foundDoctor = data.data.find(d => d._id === doctorId);
          setDoctor(foundDoctor);
        } catch (error) {
          console.error('Error fetching doctor:', error);
        }
      };
      fetchDoctor();
    }
  }, [doctor, doctorId]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });
    
    setReportFiles([...reportFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setReportFiles(reportFiles.filter((_, i) => i !== index));
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    if (!formData.symptoms.trim()) {
      alert('Please describe your symptoms');
      return;
    }

    setIsProcessing(true);

    try {
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      let reports = [];
      if (reportFiles.length > 0) {
        reports = await uploadReports(reportFiles);
        setUploadedReports(reports);
      }

      const orderData = await createOrder(
        doctor.consultationFee,
        doctorId,
        selectedSlot._id
      );

      await processPayment(
        orderData,
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        async (paymentResponse) => {
          const appointment = await createAppointment({
            doctorId,
            slotId: selectedSlot._id,
            symptoms: formData.symptoms,
            notes: formData.notes,
            paymentId: paymentResponse.paymentId,
            orderId: paymentResponse.orderId,
            paymentMethod: 'razorpay',
            reports,
          });

          setIsProcessing(false);
          navigate('/myAppointments', {
            state: { bookingSuccess: true }
          });
        },
        (error) => {
          setIsProcessing(false);
          alert('Payment failed: ' + error);
        }
      );
    } catch (error) {
      setIsProcessing(false);
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Complete the steps to book your consultation</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-semibold hidden sm:inline">Select Slot</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-semibold hidden sm:inline">Details</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-semibold hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  Select Date & Time
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(null);
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {isLoading ? (
                  <div className="py-12 flex justify-center">
                    <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-12 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No available slots for this date</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      {availableSlots.length} slots available
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot._id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-4 border-2 rounded-lg transition ${
                            selectedSlot?._id === slot._id
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 justify-center">
                            <Clock className={`w-4 h-4 ${selectedSlot?._id === slot._id ? 'text-teal-600' : 'text-gray-400'}`} />
                            <div className="text-center">
                              <p className="font-semibold text-gray-900 text-sm">
                                {slot.startTime}
                              </p>
                              <p className="text-xs text-gray-600">
                                {slot.endTime}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedSlot}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                    Appointment Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Describe Your Symptoms *
                      </label>
                      <textarea
                        value={formData.symptoms}
                        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        placeholder="Please describe your symptoms and health concerns..."
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional information you'd like the doctor to know..."
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" />
                    Upload Medical Reports (Optional)
                  </h2>

                  <div className="mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-teal-500 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF or Images (Max 5MB each)</p>
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

                  {reportFiles.length > 0 && (
                    <div className="space-y-2">
                      {reportFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-teal-600" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
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

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!formData.symptoms.trim()}
                    className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-teal-600" />
                  Payment & Confirmation
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-semibold mb-1">Review Your Booking</p>
                      <p className="text-sm text-blue-800">
                        Please review all details before proceeding with payment. The consultation fee will be charged immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(selectedDate).toLocaleDateString()} at {selectedSlot?.startTime}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-semibold text-gray-900">₹{doctor.consultationFee}</span>
                  </div>

                  {reportFiles.length > 0 && (
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Reports Attached</span>
                      <span className="font-semibold text-gray-900">{reportFiles.length} file(s)</span>
                    </div>
                  )}

                  <div className="flex justify-between py-3">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-teal-600">₹{doctor.consultationFee}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isProcessing}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={isProcessing}
                    className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay & Book
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

              <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200">
                <img
                  src={doctor.profilePicture || `https://ui-avatars.com/api/?name=${doctor.name}&size=80&background=14b8a6&color=fff&bold=true`}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{doctor.name}</h4>
                  <p className="text-sm text-teal-600">{doctor.specialization}</p>
                  <p className="text-sm text-gray-600 mt-1">{doctor.experience}y exp</p>
                </div>  
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{doctor.clinicId?.clinicName}</p>
                    <p className="text-xs text-gray-600">{doctor.clinicId?.city}</p>
                  </div>
                </div>

                {selectedSlot && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedSlot.startTime} - {selectedSlot.endTime}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(selectedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="text-xl font-bold text-teal-600">₹{doctor.consultationFee}</span>
                </div>
              </div>

              {step === 3 && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-800">
                      Payment is secure and processed through Razorpay
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;