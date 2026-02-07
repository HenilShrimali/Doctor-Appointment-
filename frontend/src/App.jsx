import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import UserSignup from './auth/user/UserSignup';
import UserLogin from './auth/user/UserLogin';
import { Toaster } from 'react-hot-toast';
import VerifyOtp from './auth/user/VerifyOtp';
import { useUserAuthStore } from './store/userAuthStore';
import UserHome from './user/UserHome';
import { useEffect } from 'react';
import ClinicRequests from './admin/ClinicRequests.jsx';
import AdminMainLayout from './layout/AdminMainLayout.jsx';
import Doctors from './admin/Doctors.jsx';
import Users from './admin/Users.jsx';
import Appointments from './admin/Appointments.jsx';
import ClinicSignup from './auth/clinic/ClinicSignup.jsx';
import ClinicLogin from './auth/clinic/ClinicLogin.jsx';
import UserMainLayout from './layout/UserMainLayout.jsx';
import FindDoctors from './user/FindDoctors.jsx';
import MyAppointments from './user/MyAppointments.jsx';
import UserHealthRecords from './user/UserHealthRecords.jsx';
import UserProfile from './user/UserProfile.jsx';
import UserNotifications from './user/UserNotifications.jsx';
import { useClinicAuthStore } from './store/clinicAuthStore.js';
import ClinicHome from './clinic/ClinicHome.jsx';
import ClinicMainLayout from './layout/ClinicMainLayout.jsx';
import Clinics from './admin/Clinics.jsx';
import ClinicDoctors from './clinic/ClinicDoctors.jsx';
import ClinicAppointments from './clinic/ClinicAppointments.jsx';
import ClinicPatients from './clinic/ClinicPatients.jsx';
import ClinicSettings from './clinic/ClinicSettings.jsx';
import ClinicNotification from './clinic/ClinicNotification.jsx';
import ClinicProfile from './clinic/ClinicProfile.jsx';
import DoctorLogin from './auth/doctor/DoctorLogin.jsx';
import { useDoctorAuthStore } from './store/doctorAuthStore.js';
import DoctorMainLayout from './layout/DoctorMainLayout.jsx';
import DoctorHome from './doctor/DoctorHome.jsx';
import DoctorProfile from './doctor/DoctorProfile.jsx';
import DoctorSettings from './doctor/DoctorSettings.jsx';
import DoctorNotifications from './doctor/DoctorNotifications.jsx';
import DoctorAppointments from './doctor/DoctorAppointments.jsx';
import DoctorSchedule from './doctor/DoctorSchedule.jsx';
import DoctorPatients from './doctor/DoctorPatients.jsx';
import NotFound from './NotFound.jsx';
import ViewDoctorProfile from './user/ViewDoctorProfile.jsx';
import BookAppointment from './user/BookAppintment.jsx';
import ChangePassword from './ChangePassword.jsx';
import ChangeClinicPassword from './ChangeClinicPassword.jsx';

function App() {
  const { user, isUserAuthenticated, isLoggedIn, checkAuth, isAuthLoading } =
    useUserAuthStore();
  const {
    isClinicAuthenticated,
    checkClinicAuth,
    isClinicAuthLoading,
  } = useClinicAuthStore();
  const { isDoctorAuthenticated, checkDoctorAuth } = useDoctorAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkClinicAuth();
  }, [checkClinicAuth]);

  useEffect(() => {
    checkDoctorAuth();
  }, [checkDoctorAuth]);

  if (isAuthLoading || isClinicAuthLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="*" element={<NotFound />} />

          {/* User routes */}
          <Route path="/user/changePassword" element={<ChangePassword />} />
          <Route
            path="/userSignup"
            element={
              !isUserAuthenticated ? (
                <UserSignup />
              ) : (
                <Navigate to="/userHome" />
              )
            }
          />
          <Route
            path="userLogin"
            element={
              !isUserAuthenticated ? (
                <UserLogin />
              ) : (
                <Navigate to={"/UserHome"} />
              )
            }
          />
          <Route
            path="/userVerify"
            element={
              !isUserAuthenticated && isLoggedIn ? (
                <VerifyOtp />
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          <Route
            path="/userHome"
            element={
              isUserAuthenticated ? (
                <UserMainLayout>
                  <UserHome />
                </UserMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />
          <Route
            path="/findDoctors"
            element={
              isUserAuthenticated ? (
                <UserMainLayout>
                  <FindDoctors />
                </UserMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />
          <Route
            path="/myAppointments"
            element={
              isUserAuthenticated ? (
                <UserMainLayout>
                  <MyAppointments />
                </UserMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />
          <Route
            path="/healthRecords"
            element={
              isUserAuthenticated ? (
                <UserMainLayout>
                  <UserHealthRecords />
                </UserMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />
          <Route
            path="/healthRecords"
            element={
              isUserAuthenticated ? (
                <UserMainLayout>
                  <UserHealthRecords />
                </UserMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isUserAuthenticated ? (
                <UserMainLayout>
                  <UserProfile />
                </UserMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />
          <Route
            path="/userNotifications"
            element={
              isUserAuthenticated ? (
                <UserMainLayout>
                  <UserNotifications />
                </UserMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          <Route
            path="/viewDoctorProfile/:doctorId"
            element={
              <UserMainLayout>
                <ViewDoctorProfile />
              </UserMainLayout>
            }
          />

          <Route
            path="/bookAppointment/:doctorId"
            element={
              isUserAuthenticated ? (
                <UserMainLayout>
                  <BookAppointment />
                </UserMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          {/* Admin ROutes */}
          <Route
            path="/admin/clinicRequests"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <ClinicRequests />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          <Route
            path="/admin/doctors"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <Doctors />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          <Route
            path="/admin/users"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <Users />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          <Route
            path="/admin/appointments"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <Appointments />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          <Route
            path="/admin/clinics"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <Clinics />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          {/* Clinic Routes */}
          <Route path='/clinic/changePassword' element={<ChangeClinicPassword />}/>
          <Route
            path="/clinicSignup"
            element={
              !isClinicAuthenticated ? (
                <ClinicSignup />
              ) : (
                <Navigate to={"/clinicHome"} />
              )
            }
          />

          <Route
            path="/clinicLogin"
            element={
              !isClinicAuthenticated ? (
                <ClinicLogin />
              ) : (
                <Navigate to={"/clinicHome"} />
              )
            }
          />

          <Route
            path="/clinicHome"
            element={
              isClinicAuthenticated ? (
                <ClinicMainLayout>
                  <ClinicHome />
                </ClinicMainLayout>
              ) : (
                <Navigate to="/clinicLogin" />
              )
            }
          />

          <Route
            path="/clinicDoctors"
            element={
              isClinicAuthenticated ? (
                <ClinicMainLayout>
                  <ClinicDoctors />
                </ClinicMainLayout>
              ) : (
                <Navigate to="/clinicLogin" />
              )
            }
          />

          <Route
            path="/clinicAppointments"
            element={
              isClinicAuthenticated ? (
                <ClinicMainLayout>
                  <ClinicAppointments />
                </ClinicMainLayout>
              ) : (
                <Navigate to="/clinicLogin" />
              )
            }
          />

          <Route
            path="/clinicPatients"
            element={
              isClinicAuthenticated ? (
                <ClinicMainLayout>
                  <ClinicPatients />
                </ClinicMainLayout>
              ) : (
                <Navigate to="/clinicLogin" />
              )
            }
          />

          <Route
            path="/clinicProfile"
            element={
              isClinicAuthenticated ? (
                <ClinicMainLayout>
                  <ClinicProfile />
                </ClinicMainLayout>
              ) : (
                <Navigate to="/clinicLogin" />
              )
            }
          />

          <Route
            path="/clinicSettings"
            element={
              isClinicAuthenticated ? (
                <ClinicMainLayout>
                  <ClinicSettings />
                </ClinicMainLayout>
              ) : (
                <Navigate to="/clinicLogin" />
              )
            }
          />

          <Route
            path="/clinicNotifications"
            element={
              isClinicAuthenticated ? (
                <ClinicMainLayout>
                  <ClinicNotification />
                </ClinicMainLayout>
              ) : (
                <Navigate to="/clinicLogin" />
              )
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctorLogin"
            element={
              !isDoctorAuthenticated ? (
                <DoctorLogin />
              ) : (
                <Navigate to={"/doctorHome"} />
              )
            }
          />

          <Route
            path="/doctorHome"
            element={
              isDoctorAuthenticated ? (
                <DoctorMainLayout>
                  <DoctorHome />
                </DoctorMainLayout>
              ) : (
                <Navigate to={"/doctorLogin"} />
              )
            }
          />

          <Route
            path="/doctorProfile"
            element={
              isDoctorAuthenticated ? (
                <DoctorMainLayout>
                  <DoctorProfile />
                </DoctorMainLayout>
              ) : (
                <Navigate to={"/doctorLogin"} />
              )
            }
          />

          <Route
            path="/doctorSettings"
            element={
              isDoctorAuthenticated ? (
                <DoctorMainLayout>
                  <DoctorSettings />
                </DoctorMainLayout>
              ) : (
                <Navigate to={"/doctorLogin"} />
              )
            }
          />

          <Route
            path="/doctorNotifications"
            element={
              isDoctorAuthenticated ? (
                <DoctorMainLayout>
                  <DoctorNotifications />
                </DoctorMainLayout>
              ) : (
                <Navigate to={"/doctorLogin"} />
              )
            }
          />

          <Route
            path="/doctorAppointments"
            element={
              isDoctorAuthenticated ? (
                <DoctorMainLayout>
                  <DoctorAppointments />
                </DoctorMainLayout>
              ) : (
                <Navigate to={"/doctorLogin"} />
              )
            }
          />

          <Route
            path="/doctorSchedule"
            element={
              isDoctorAuthenticated ? (
                <DoctorMainLayout>
                  <DoctorSchedule />
                </DoctorMainLayout>
              ) : (
                <Navigate to={"/doctorLogin"} />
              )
            }
          />

          <Route
            path="/doctorPatients"
            element={
              isDoctorAuthenticated ? (
                <DoctorMainLayout>
                  <DoctorPatients />
                </DoctorMainLayout>
              ) : (
                <Navigate to={"/doctorLogin"} />
              )
            }
          />
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App
