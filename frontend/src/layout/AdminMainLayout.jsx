import React from "react";
import AdminNavbar from "../components/AdminNavbar.jsx";

function AdminMainLayout({ children }) {
  return (
    <div>
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}

export default AdminMainLayout;
