import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/env"; // Adjust the import path

export default function UserTable({
  reportData,
  setReportData,
  filter,
  searchTerm,
  currentPage,
  entriesPerPage,
  setTestCount,
  setTotalEntries,
}) {
  const filteredResults = reportData.filter(
    (item) =>
      (filter === "" || item.userId === filter) &&
      (searchTerm === "" ||
        item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.userId).toLowerCase().includes(searchTerm.toLowerCase())) // Convert to string
  );

  // Update total entries
  useEffect(() => {
    setTotalEntries(filteredResults.length);
  }, [filteredResults, setTotalEntries]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredResults.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  setTestCount(currentEntries.length);

  // Function to handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${BASE_URL}/superAdmin/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        // Update state to remove the deleted user from reportData
        setReportData((prevData) => prevData.filter((item) => item._id !== id)); // Use _id for filtering

        alert("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        // Handle error (e.g., show an error message)
      }
    }
  };

  return (
    <div className="w-full">
      <table className="w-full bg-blue-200 rounded-lg overflow-hidden">
        <thead className="w-full bg-blue-200 h-14 py-10">
          <tr className="w-full text-gray-700 text-sm font-normal leading-normal">
            <th className="py-4 px-6 text-left">Sr. No</th>
            <th className="py-4 px-6 text-left">User ID</th>
            <th className="py-4 px-6 text-left">Name</th>
            <th className="py-4 px-6 text-left">Email</th>
            <th className="py-4 px-6 text-left">Contact No</th>
            <th className="py-4 px-6 text-left">Clinic Name</th>
            <th className="py-4 px-6 text-left">User Name</th>
            <th className="py-4 px-6 text-left">Password</th>
            <th className="w-36 py-4 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentEntries.map((item, index) => (
            <tr
              key={item._id} // Use _id as key for better performance
              className={`text-gray-700 text-sm font-normal leading-normal ${
                index % 2 === 0
                  ? "bg-gray-100"
                  : "bg-white border-b border-t border-gray-300"
              }`}
            >
              <td className="py-4 px-6 text-left">{index + 1}</td>
              <td className="py-4 px-6 text-left">{item.userId}</td>
              <td className="py-4 px-6 text-left text-blue-700 underline">
                <Link to={`/superAdmin/userDetail/${item._id}`}>
                  {item.firstName} {item.lastName}
                </Link>
              </td>
              <td className="py-4 px-6 text-left">{item.email}</td>
              <td className="py-4 px-6 text-left">{item.contactNumber}</td>
              <td className="py-4 px-6 text-left">{item.clinicName}</td>
              <td className="py-4 px-6 text-left">{item.userName}</td>
              <td className="py-4 px-6 text-left">{item.password}</td>
              <td className="py-4 px-6 text-left flex gap-2 items-center justify-center">
                <Link
                  to={`/superAdmin/editUser/${item._id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                |
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(item._id)} // Call delete function with _id
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
