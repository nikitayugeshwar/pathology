import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { SlRefresh } from "react-icons/sl";
import { Link } from "react-router-dom";
import UserTable from "./UserTable";

import { BASE_URL } from "../utils/env"; // Adjust the import path

export default function UserManagement() {
  const [reportData, setReportData] = useState([]);
  const [user, setUser] = useState({});
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [TestCount, setTestCount] = useState("");
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

  // Fetch current user data to get superAdminId (user._id)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/superAdminAuth/user`, {
          withCredentials: true,
        });

        if (res.status !== 200) {
          throw new Error("Failed to fetch user data");
        }

        const data = res.data.user;

        setUser(data);
        setIsUserLoaded(true); // Set flag to true once user data is loaded
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch super admins by superAdminId once user data is available
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user._id) {
          const superAdminId = user._id;

          // Ensure user._id (superAdminId) is available
          const response = await fetch(
            `${BASE_URL}/superAdmin/superAdminId/${superAdminId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await response.json();
          setReportData(data); // Set data specific to superAdminId
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isUserLoaded) {
      fetchData();
    }
  }, [user._id, isUserLoaded, refreshKey]); // Only run when user data is loaded

  return (
    <>
      <div className="h-screen w-full flex flex-col gap-5 pt-5 px-5">
        <div className="h-12 w-full flex flex-row items-center justify-between">
          <div className="flex flex-row gap-6 justify-between w-full">
            <h1 className="text-black text-lg font-medium">
              Total Users: {reportData.length} {/* Show total users */}
            </h1>
          </div>

          <Link to={"/superAdmin/addUser"}>
            <button className="w-32 py-2 bg-blue-900 text-white font-semibold rounded-md">
              Add New
            </button>
          </Link>
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
            <UserTable
              reportData={reportData}
              setReportData={setReportData}
              filter={filter}
              searchTerm={searchTerm}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              setTestCount={setTestCount}
              setTotalEntries={setTotalEntries} // Pass total entries updater
            />{" "}
            {/* Pass data as props */}
          </div>
        </div>
      </div>
    </>
  );
}
