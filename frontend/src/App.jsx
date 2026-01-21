import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import UserSignup from './auth/user/UserSignup';
import UserLogin from './auth/user/UserLogin';
import { Toaster } from 'react-hot-toast';
import VerifyOtp from './auth/user/VerifyOtp';
import { useUserAuthStore } from './store/userAuthStore';
import UserHome from './user/UserHome';
import { useEffect } from 'react';

function App() {
  const { user, isUserAuthenticated, isLoggedIn, checkAuth } = useUserAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />

          {/* User routes */}
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
              !isUserAuthenticated  ? (
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
              isUserAuthenticated ? <UserHome /> : <Navigate to="/userLogin" />
            }
          />
        </Routes>

      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App
