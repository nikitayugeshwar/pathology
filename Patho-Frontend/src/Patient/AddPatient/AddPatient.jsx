import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import AddForm from "./AddForm";

import { BASE_URL } from "../../utils/env";

const AddPatient = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/protected`, {
          withCredentials: true, // Important to send cookies
        });
      } catch (error) {
        // If access token is expired, attempt to refresh it
        if (error.response && error.response.status === 401) {
          await refreshAccessToken();
        } else {
          setIsLoggedIn(false);
          navigate("/userLogin"); // Redirect to login page if not logged in
        }
      }
    };

    const refreshAccessToken = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/refresh-token`,
          {},
          {
            withCredentials: true, // Important to send cookies
          }
        );

        // After refreshing, check for valid dashboard access again
        await checkAuth();
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
        setIsLoggedIn(false);
        navigate("/userLogin"); // Redirect to login page if refresh fails
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isLoggedIn) {
    return <div>Logging out...</div>;
  }
  return (
    <>
      {" "}
      <div className="h-screen w-full flex flex-col px-5 py-10 gap-10">
        <div className="w-full">
          <Link to={"/Dashboard/Patient"}>
            <button className="flex items-center justify-center gap-3">
              <FaArrowLeftLong className="h-10 w-10 bg-gray-100 rounded-full p-2" />
              <h1 className="text-lg font-semibold">Back</h1>
            </button>
          </Link>
        </div>

        {/* form */}
        <AddForm />
      </div>
    </>
  );
};

export default AddPatient;
