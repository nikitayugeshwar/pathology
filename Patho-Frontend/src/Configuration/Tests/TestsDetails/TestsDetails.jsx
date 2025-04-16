import axios from "axios";

import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../utils/env";

const TestsDetails = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [reports, setReports] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/protected`, {
          withCredentials: true,
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await refreshAccessToken();
        } else {
          setIsLoggedIn(false);
          navigate("/");
        }
      }
    };

    const refreshAccessToken = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/refresh-token`,
          {},
          { withCredentials: true }
        );
        await checkAuth();
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
        setIsLoggedIn(false);
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isLoggedIn) {
    return <div>Logging out...</div>;
  }

  const { id } = useParams();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/testdetails/id/${id}`
        );
        console.log("test details in ", response);

        if (response?.data) {
          setReports(response.data);
        } else {
          throw new Error("No data found");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        setReports({});
      }
    };

    fetchReport();
  }, [id]);

  return (
    <>
      <div className="h-auto w-full flex flex-col p-5 gap-10">
        <div className="flex w-full justify-between items-center">
          <Link to={"/Dashboard/Tests"}>
            <button className="flex items-center justify-center gap-2">
              <FaArrowLeftLong className="h-10 w-10 bg-gray-100 rounded-full p-2" />
              <h1 className="text-lg font-semibold">Back</h1>
            </button>
          </Link>
        </div>

        <div className="w-full flex flex-col rounded-t-xl overflow-hidden">
          <div className="w-full h-12 px-5 flex items-center bg-violet-200">
            <h1 className="text-blue-900 font-semibold ">Test Name</h1>
          </div>
          <div className="p-5 w-full h-auto flex flex-col gap-10 border border-gray-300 rounded-b-lg">
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-gray-400 font-normal text-lg">Test Name</h1>
              <h1 className="text-black font-medium text-lg">
                {reports?.testName || "Loading..."}
              </h1>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col rounded-t-xl overflow-hidden">
          <div className="w-full h-12 px-5 flex items-center bg-violet-200">
            <h1 className="text-blue-900 font-semibold ">
              {reports?.testName || "Loading..."}
            </h1>
          </div>

          <div className="p-5 w-full h-auto flex flex-col gap-10 border border-gray-300 rounded-b-lg">
            {reports?.fields?.length === 0 ? (
              <p>No fields found for this test.</p>
            ) : (
              (reports?.fields || []).map((field, index) => (
                <div key={index} className="grid grid-cols-3">
                  <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-gray-400 font-normal text-lg">
                      Field Name
                    </h1>
                    <h1 className="text-black font-medium text-lg">
                      {field.fieldName}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-gray-400 font-normal text-lg">Units</h1>
                    <h1 className="text-black font-medium text-lg">
                      {field.units}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-gray-400 font-normal text-lg">
                      Reference Range
                    </h1>
                    <h1 className="text-black font-medium text-lg">
                      {field.referenceRange}
                    </h1>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestsDetails;
