import React, { useState } from "react";
import { Link } from "react-router-dom";

function Otpvarification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(20); // assuming 20 seconds timer

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus on next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle OTP verification
    alert(`OTP entered: ${otp.join("")}`);
  };

  // Resend OTP logic here
  const resendOTP = () => {
    setOtp(new Array(6).fill(""));
    setTimeLeft(20); // reset timer
    // logic to resend OTP
  };

  // Timer logic
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[550px] ">
        <h2 className="text-2xl font-semibold mb-2">OTP Verification</h2>
        <p className="text-gray-600 mb-6 text-sm">
          We just sent a 6 digit code to your 9999999999. Enter the code below
          to confirm your account
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-4">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 border border-gray-300 text-center text-lg rounded-lg"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                required
              />
            ))}
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Didn’t receive the code?{" "}
              <span
                onClick={resendOTP}
                className="text-blue-700 cursor-pointer underline"
              >
                Resend
              </span>
            </p>
            <p className="text-gray-600 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m-3 6a9 9 0 110-18 9 9 0 010 18z"
                ></path>
              </svg>
              {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
            </p>
          </div>

          <Link to={"/Dashboard"}>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Otpvarification;
