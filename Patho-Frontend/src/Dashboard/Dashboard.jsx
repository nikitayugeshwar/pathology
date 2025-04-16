import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NewPatientToday from "../component/NewPatientToday";
import PatientTable from "../component/PatientTable";
import ReportTable from "../component/ReportTable";
import TotalPatient from "../component/TotalPatient";

import NewTestsToday from "../component/NewTestsToday";
import PendingReportCount from "../component/PendingReportCount";

import { BASE_URL } from "../utils/env";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/dashboard`, {
          withCredentials: true, // Important to send cookies
        });
        console.log("dashboard res", res);
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
    <div className="flex flex-col gap-5 p-7">
      {/* Color cards */}
      <div className="flex w-full gap-9">
        <TotalPatient />
        <NewPatientToday />
        <NewTestsToday />
        <PendingReportCount />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="w-full flex flex-row justify-between">
          <h1 className="text-black text-xl font-bold">Patient</h1>
          <Link to={"/Dashboard/Patient"}>
            <button className="text-sm text-blue-600 underline">See All</button>
          </Link>
        </div>
      </div>

      <div className="h-auto w-full flex flex-col">
        <PatientTable />
      </div>
      <div className="h-auto w-full flex flex-col">
        <ReportTable />
      </div>
    </div>
  );
}
