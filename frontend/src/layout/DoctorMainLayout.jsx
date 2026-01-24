import React from "react";
import DoctorNavbar from "../components/DoctorNavbar";

function DoctorMainLayout({ children }) {
  return (
    <div>
      <DoctorNavbar />
      <main>{children}</main>
    </div>
  );
}

export default DoctorMainLayout;
