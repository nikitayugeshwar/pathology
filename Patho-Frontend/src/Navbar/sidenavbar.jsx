import React, { useState } from "react";
import { Link } from "react-router-dom";
import configuration from "./img/configuration.png";
import dashboard from "./img/dashboard.png";
import logo from "./img/logo.png";
import patient from "./img/patient.png";
import report from "./img/report.png";
import test from "./img/test.png";

export default function Sidenavbar({ isOpen, toggleSidebar }) {
  const [isSelected, setIsSelected] = useState(1);

  const handleSelect = (value) => {
    setIsSelected(value);
  };

  return (
    <>
      <div className="lg:w-[257px]">
        <div className="lg:w-[257px] fixed">
          <div
            className={`lg:relative lg:-translate-x-0 fixed top-0 left-0 z-40 h-screen w-[257px] transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } lg:w-[257px]  shadow-xl`}
          >
            <div className="h-screen w-[257px] flex flex-col bg-white ">
              <div className="p-5">
                <img src={logo} alt="Logo" />
              </div>
              <Link to="/Dashboard">
                <button
                  onClick={() => handleSelect(1)}
                  className={`${
                    isSelected === 1 ? "bg-blue-900 text-white" : "text-black"
                  } h-[50px] w-full px-5 py-3 flex gap-3 `}
                >
                  <img
                    src={dashboard}
                    alt="Dashboard"
                    className={`h-6 w-6 ${
                      isSelected === 1 ? "invert-0" : "invert"
                    }`}
                  />
                  <h1>Dashboard</h1>
                </button>
              </Link>
              <Link to="/Dashboard/Patient">
                <button
                  onClick={() => handleSelect(7)}
                  className={`${
                    isSelected === 7 ? "bg-blue-900 text-white" : "text-black"
                  } h-[50px] w-full px-5 py-3 flex gap-3`}
                >
                  <img
                    src={patient}
                    alt="Student"
                    className={`h-6 w-6 ${
                      isSelected === 7 ? "invert" : "invert-0"
                    }`}
                  />
                  <h1>Patient</h1>
                </button>
              </Link>
              <Link to="/Dashboard/Test">
                <button
                  onClick={() => handleSelect(2)}
                  className={`${
                    isSelected === 2 ? "bg-blue-900 text-white" : "text-black"
                  } h-[50px] w-full px-5 py-3 flex gap-3`}
                >
                  <img
                    src={test}
                    alt="Exam"
                    className={`h-6 w-6 ${
                      isSelected === 2 ? "invert" : "invert-0"
                    }`}
                  />
                  <h1>Test</h1>
                </button>
              </Link>
              <Link to="/Dashboard/Report">
                <button
                  onClick={() => handleSelect(3)}
                  className={`${
                    isSelected === 3 ? "bg-blue-900 text-white" : "text-black"
                  } h-[50px] w-full px-5 py-3 flex gap-3`}
                >
                  <img
                    src={report}
                    alt="Result"
                    className={`h-6 w-6 ${
                      isSelected === 3 ? "invert" : "invert-0"
                    }`}
                  />
                  <h1>Report</h1>
                </button>
              </Link>

              <Link to="/Dashboard/configuration">
                <button
                  onClick={() => handleSelect(6)}
                  className={`${
                    isSelected === 6 ? "bg-blue-900 text-white" : "text-black"
                  } h-[50px] w-full px-5 py-3 flex gap-3`}
                >
                  <img
                    src={configuration}
                    alt="Configuration"
                    className={`h-6 w-6 ${
                      isSelected === 6 ? "invert" : "invert-0"
                    }`}
                  />
                  <h1>Configuration</h1>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
