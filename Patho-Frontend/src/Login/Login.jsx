import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import login from "./login.png";

import { BASE_URL } from "../utils/env";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/check-login`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          // If user is already logged in, redirect to the dashboard
          navigate("/dashboard");
        }
      } catch (error) {
        // User is not logged in; do nothing
      }
    };

    // checkLoginStatus();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
    try {
      const response = await axios.post(
        `${BASE_URL}/api/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("response", response);

      if (response.status === 200) {
        navigate("/Dashboard");
      }
    } catch (error) {
      console.log("error", error);
      // Display specific error messages based on the backend response
      if (error.response && error.response.data.message) {
        setError(error.response.data.message); // Set the error message returned by the server
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="h-screen w-full flex flex-col lg:flex-row">
        <div className="h-1/3 lg:h-full w-full lg:w-1/2 bg-blue-900 flex items-center justify-center">
          <img src={login} className="w-[400px] h-[500px] object-cover" />
        </div>
        <div className="h-2/3 lg:h-full w-full lg:w-1/2 flex flex-col p-5 pt-16 lg:pt-36">
          <form onSubmit={handleLogin} className="flex w-full flex-col gap-5">
            <div>
              <h1 className="text-black text-2xl lg:text-3xl font-bold">
                Welcome Back
              </h1>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-black text-lg lg:text-xl font-semibold">
                Log In Screen
              </h1>
              <p className="text-sm text-gray-500">
                Please Login To Your Account
              </p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col gap-3" data-testid="email-input">
              <h1 className="text-black text-md lg:text-lg font-medium">
                Email
              </h1>
              <input
                type="email"
                placeholder="Type here.."
                className="h-12 lg:h-14 w-full lg:w-[90%] border border-gray-300 rounded-lg p-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-3" data-testid="password-input">
              <h1 className="text-black text-md lg:text-lg font-medium">
                Password
              </h1>
              <div className="flex items-center relative">
                <input
                  placeholder="Type here.."
                  className="h-12 lg:h-14 w-full lg:w-[90%] border border-gray-300 rounded-lg p-2 outline-none"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-3 lg:right-20 text-teal-500 hover:text-teal-700 py-1 px-2"
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
            <div className="flex flex-row justify-between w-full lg:w-[90%]">
              <div className="flex flex-row gap-2">
                <input type="checkbox" />
                <h1 className="text-gray-500 text-sm">Remember Me</h1>
              </div>
              <div>
                <Link to="/ForgotPass">
                  <button className="text-gray-500 text-sm underline">
                    Forget Password?
                  </button>
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="h-12 lg:h-16 w-full lg:w-[90%] bg-blue-900 text-white text-md font-semibold rounded-lg"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
