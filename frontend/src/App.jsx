import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import UserSignup from './auth/user/UserSignup';
import UserLogin from './auth/user/UserLogin';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          {/* User routes */}
          <Route path="/userSignup" element={<UserSignup />} />
          <Route path="userLogin" element={<UserLogin />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
