import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/env";

const ForgotPass = () => {
  const [emailOrMobile, setEmailOrMobile] = useState(""); // State for email or mobile input
  const [otp, setOtp] = useState(""); // State for OTP
  const [otpSent, setOtpSent] = useState(false); // State to check if OTP is sent
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/api/send-otp`, { emailOrMobile });
      setOtpSent(true);
      setError("");
    } catch (error) {
      setError("Failed to send OTP. Please check your input.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/verify-otp`,
        { emailOrMobile, otp },
        {
          withCredentials: true, // Important to send cookies
        }
      );

      const token = response.data.token;
      // Redirect to ChangePass with the user ID in the URL
      if (token) {
        navigate(`/ChangePass`);
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <div className="h-2/3 lg:h-full w-full lg:w-1/2 flex flex-col p-5 pt-16 lg:pt-36">
        {!otpSent ? (
          <form className="flex w-full flex-col gap-5">
            <div>
              <h1 className="text-black text-2xl lg:text-3xl font-bold">
                Forgot Password
              </h1>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-black text-lg lg:text-xl font-semibold">
                Email or Mobile Number
              </h1>
              <input
                type="text"
                placeholder="Enter your email or mobile number"
                className="h-12 lg:h-14 w-full lg:w-[90%] border border-gray-300 rounded-lg p-2 outline-none"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              className="h-12 lg:h-16 w-full lg:w-[90%] bg-blue-900 text-white text-md font-semibold rounded-lg"
            >
              Send OTP
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        ) : (
          <form className="flex w-full flex-col gap-5">
            <div>
              <h1 className="text-black text-2xl lg:text-3xl font-bold">
                Enter OTP
              </h1>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter the OTP"
                className="h-12 lg:h-14 w-full lg:w-[90%] border border-gray-300 rounded-lg p-2 outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="h-12 lg:h-16 w-full lg:w-[90%] bg-blue-900 text-white text-md font-semibold rounded-lg"
            >
              Verify OTP
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
