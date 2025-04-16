"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import dashboard from "./img/dashboard.png";
import logo from "./img/logo.png";

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
              <Link to="/superAdmin">
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
                  <h1>User Management</h1>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
