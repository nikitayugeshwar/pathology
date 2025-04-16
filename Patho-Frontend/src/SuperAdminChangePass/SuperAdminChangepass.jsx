import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/env";

export default function SuperAdminChangepass() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility2 = () => {
    setPasswordVisible2(!passwordVisible2);
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/superAdminAuth/change-password`,
        { newPassword },
        {
          withCredentials: true,
        }
      );

      alert("Password changed successfully!");

      navigate("/SuperAdminLogin");
    } catch (error) {
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[550px]">
          <div className="flex w-full flex-col gap-5">
            <div>
              <h1 className="text-black text-3xl font-bold">Change Password</h1>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-lg font-medium">New Password</h1>
              <div className="flex items-center relative">
                <input
                  placeholder="******"
                  className="h-14 w-[90%] border border-gray-300 rounded-lg p-2 outline-none"
                  type={passwordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-12 text-gray-300 py-1 px-2"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <FaEyeSlash size={24} />
                  ) : (
                    <FaEye size={24} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-lg font-medium">Confirm Password</h1>
              <div className="flex items-center relative">
                <input
                  placeholder="******"
                  className="h-14 w-[90%] border border-gray-300 rounded-lg p-2 outline-none"
                  type={passwordVisible2 ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-12 text-gray-300 py-1 px-2"
                  type="button"
                  onClick={togglePasswordVisibility2}
                >
                  {passwordVisible2 ? (
                    <FaEyeSlash size={24} />
                  ) : (
                    <FaEye size={24} />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSavePassword}
              className="h-16 w-[90%] bg-blue-900 text-white text-md font-semibold rounded-lg"
            >
              Save
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
