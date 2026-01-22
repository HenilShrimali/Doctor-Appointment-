import React from "react";
import ClinicNavbar from "../components/ClinicNavbar";

function ClinicMainLayout({ children }) {
  return (
    <div>
      <ClinicNavbar />
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
}

export default ClinicMainLayout;
