import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { SlRefresh } from "react-icons/sl";
import ReportTable from "./ReportTable";
import { useState } from "react";
export default function Report() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [reportCount, setReportCount] = useState(0); // Updated name for clarity
  const [totalEntries, setTotalEntries] = useState(0); // New state for total entries

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setSearchTerm("");
    setFilter("");
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="h-screen w-full flex flex-col gap-5 pt-5 px-5">
        <div className="h-12 w-full flex flex-row items-center justify-between">
          <div className="flex flex-row gap-6 justify-between w-full">
            <h1 className="text-black text-lg font-medium">
              Report: {reportCount} / {totalEntries}{" "}
              {/* Display current and total */}
            </h1>
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

              {/* Pagination buttons */}
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
            <ReportTable
              filter={filter}
              searchTerm={searchTerm}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              setReportCount={setReportCount}
              setTotalEntries={setTotalEntries} // Pass total entries updater
              refreshKey={refreshKey}
            />
          </div>
        </div>
      </div>
    </>
  );
}
