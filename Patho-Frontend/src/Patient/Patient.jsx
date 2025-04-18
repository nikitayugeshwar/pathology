import axios from "axios";
import React, { useEffect, useState } from "react";

import { CiSearch } from "react-icons/ci";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { SlRefresh } from "react-icons/sl";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PatientTable from "./PatientTable";

import { BASE_URL } from "../utils/env";

export default function Patient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setSearchTerm("");
    setFilter("");
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/protected`, {
          withCredentials: true, // Important to send cookies
        });
        console.log("protected res", res);
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
  // Get patients data from Redux store
  const { patients } = useSelector((state) => state.patient);
  const totalPatients = patients?.length || 0; // Calculate the total number of patients

  return (
    <>
      <div className="h-screen w-full flex flex-col gap-5  pt-5 px-5 ">
        <div className="h-12 w-full flex flex-row items-center justify-between">
          <div className="flex flex-row gap-6 justify-between w-full ">
            {/* Show the total number of patients */}
            <h1 className="text-black text-lg font-medium ">
              Total Patient: {totalPatients}
            </h1>
            <div className="flex items-center justify-center gap-5">
              <Link to={"/Dashboard/Addpatient"}>
                <button className="h-10 w-28 text-base font-semibold text-white bg-blue-900 rounded-lg">
                  Add New
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="h-auto w-full flex flex-col rounded-lg border border-gray-300">
          <div className="h-20 w-full flex flex-row items-center justify-between px-5">
            <div className="flex flex-row gap-5">
              <h1>Show</h1>
              <select
                className="h-6 w-12"
                value={entriesPerPage}
                onChange={handleEntriesChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <h1>Entries</h1>
              <div
                className="flex flex-row gap-2 items-center justify-center cursor-pointer"
                onClick={handleRefresh}
              >
                <SlRefresh />
                <h1>Refresh</h1>
              </div>
            </div>
            <div className="flex flex-row relative">
              <div className="flex flex-row items-center p-2 gap-3">
                <input
                  placeholder="Search"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-10 w-64 rounded-lg border text-gray-700 border-gray-300 pl-8 placeholder:text-gray-500 outline-none"
                />
                <div className="flex flex-row gap-2 absolute left-5">
                  <CiSearch size={20} />
                </div>
              </div>

              {/* pagination button */}
              <div className="flex flex-row gap-1 items-center justify-center">
                <button
                  className="h-10 w-12 bg-gray-300 rounded-md flex items-center justify-center"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <FaAngleLeft color="black" size={25} />
                </button>
                <button className="h-10 w-12 bg-white border border-gray-300 rounded-md text-xl">
                  {currentPage}
                </button>
                <button
                  className="h-10 w-12 bg-gray-300 rounded-md flex items-center justify-center"
                  onClick={handleNextPage}
                  disabled={
                    currentPage >= Math.ceil(totalEntries / entriesPerPage)
                  }
                >
                  <FaAngleRight color="black" size={25} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <PatientTable
              filter={filter}
              searchTerm={searchTerm}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              setTotalEntries={setTotalEntries} // Pass total entries updater
              refreshKey={refreshKey}
            />
          </div>
        </div>
      </div>
    </>
  );
}
