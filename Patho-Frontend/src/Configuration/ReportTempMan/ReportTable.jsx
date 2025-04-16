import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteConfigTemplate,
  fetchConfigTemplates,
  resetSuccess,
} from "../../Redux/configTemplateSlice"; // Adjust path accordingly

export default function ReportTable({
  filter,
  searchTerm,
  currentPage,
  entriesPerPage,
  setReportCount,
  setTotalEntries, // New prop for total entries
  refreshKey,
}) {
  const dispatch = useDispatch();
  const { configTemplates, loading, successMessage } = useSelector(
    (state) => state.configTemplate
  );
  const { userId = {} } = useSelector(
    (state) => state.user || { userId: null }
  );

  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(fetchConfigTemplates(userId));
    }
  }, [dispatch, successMessage, userId, refreshKey]);

  const filteredResults = configTemplates.filter(
    (item) =>
      filter === "" &&
      (searchTerm === "" ||
        item.clinicName.toLowerCase().includes(searchTerm.toLowerCase())) // Convert to string
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredResults.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  setReportCount(currentEntries.length);

  // Update current page report count
  useEffect(() => {
    setReportCount(currentEntries.length);
  }, [currentEntries, setReportCount]);

  // Display success message if deletion is successful
  useEffect(() => {
    if (successMessage) {
      setDeleteMessage("Report deleted successfully.");
      setTimeout(() => {
        setDeleteMessage("");
        dispatch(resetSuccess());
      }, 3000);
    }
  }, [successMessage]);

  // Handle delete action
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      dispatch(deleteConfigTemplate(id));
    }
  };

  return (
    <div className="w-full">
      {deleteMessage && (
        <p className="text-green-500 font-semibold mb-4">{deleteMessage}</p>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-blue-200 rounded-lg overflow-hidden">
          <thead className="w-full bg-blue-200 h-14 py-10">
            <tr className="w-full text-gray-700 text-sm font-normal leading-normal">
              <th className="py-4 px-6 text-left">Sr. No</th>
              <th className="py-4 px-6 text-left">Clinic Name</th>
              <th className="py-4 px-6 text-left pr-64">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light pr-44">
            {currentEntries.map((item, index) => (
              <tr
                key={item._id}
                className={`text-gray-700 text-sm font-normal leading-normal ${
                  index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white border-b border-t border-gray-300"
                }`}
              >
                <td className="py-4 px-6 text-left">{index + 1}</td>
                <td className="py-4 px-6 text-left">{item.clinicName}</td>
                <td className="py-4 px-6 text-left flex gap-3">
                  <Link to={`/Dashboard/EditReport/${item._id}`}>
                    <button className="text-blue-600">Edit</button>
                  </Link>
                  <h1>|</h1>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
