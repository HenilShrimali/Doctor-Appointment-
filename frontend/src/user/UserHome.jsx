import React from 'react'
import { useEffect } from 'react'
import { useUserAuthStore } from '../store/userAuthStore';
import { useNavigate } from 'react-router-dom';

function UserHome() {
  const {user} = useUserAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.role==="admin"){
      navigate("/admin/clinicRequests");
      return;
    }
  }, [user]);
  return (
    <div>UserHome</div>
  )
}

export default UserHome