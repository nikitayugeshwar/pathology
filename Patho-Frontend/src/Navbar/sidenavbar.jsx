import React from "react";
import { Link, useLocation } from "react-router-dom"; // 👈 import useLocation
import configuration from "./img/configuration.png";
import dashboard from "./img/dashboard.png";
import logo from "./img/logo.png";
import patient from "./img/patient.png";
import report from "./img/report.png";
import test from "./img/test.png";

export default function Sidenavbar({ isOpen, toggleSidebar }) {
  const location = useLocation(); // 👈 get current location

  // 👇 Define a helper function to check active path
  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:w-[257px]">
      <div className="lg:w-[257px] fixed">
        <div
          className={`lg:relative lg:-translate-x-0 fixed top-0 left-0 z-40 h-screen w-[257px] transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-xl`}
        >
          <div className="h-screen w-[257px] flex flex-col bg-white">
            <div className="p-5">
              <img src={logo} alt="Logo" />
            </div>
            <Link to="/Dashboard">
              <button
                className={`${
                  isActive("/Dashboard")
                    ? "bg-blue-900 text-white"
                    : "text-black"
                } h-[50px] w-full px-5 py-3 flex gap-3`}
              >
                <img
                  src={dashboard}
                  alt="Dashboard"
                  className={`h-6 w-6 ${
                    isActive("/Dashboard") ? "invert-0" : "invert"
                  }`}
                />
                <h1>Dashboard</h1>
              </button>
            </Link>
            <Link to="/Dashboard/Patient">
              <button
                className={`${
                  isActive("/Dashboard/Patient")
                    ? "bg-blue-900 text-white"
                    : "text-black"
                } h-[50px] w-full px-5 py-3 flex gap-3`}
              >
                <img
                  src={patient}
                  alt="Student"
                  className={`h-6 w-6 ${
                    isActive("/Dashboard/Patient") ? "invert" : "invert-0"
                  }`}
                />
                <h1>Patient</h1>
              </button>
            </Link>
            <Link to="/Dashboard/Test">
              <button
                className={`${
                  isActive("/Dashboard/Test")
                    ? "bg-blue-900 text-white"
                    : "text-black"
                } h-[50px] w-full px-5 py-3 flex gap-3`}
              >
                <img
                  src={test}
                  alt="Exam"
                  className={`h-6 w-6 ${
                    isActive("/Dashboard/Test") ? "invert" : "invert-0"
                  }`}
                />
                <h1>Test</h1>
              </button>
            </Link>
            <Link to="/Dashboard/Report">
              <button
                className={`${
                  isActive("/Dashboard/Report")
                    ? "bg-blue-900 text-white"
                    : "text-black"
                } h-[50px] w-full px-5 py-3 flex gap-3`}
              >
                <img
                  src={report}
                  alt="Result"
                  className={`h-6 w-6 ${
                    isActive("/Dashboard/Report") ? "invert" : "invert-0"
                  }`}
                />
                <h1>Report</h1>
              </button>
            </Link>
            <Link to="/Dashboard/configuration">
              <button
                className={`${
                  isActive("/Dashboard/configuration")
                    ? "bg-blue-900 text-white"
                    : "text-black"
                } h-[50px] w-full px-5 py-3 flex gap-3`}
              >
                <img
                  src={configuration}
                  alt="Configuration"
                  className={`h-6 w-6 ${
                    isActive("/Dashboard/configuration") ? "invert" : "invert-0"
                  }`}
                />
                <h1>Configuration</h1>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
