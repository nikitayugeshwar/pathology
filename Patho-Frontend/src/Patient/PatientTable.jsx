import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearMessage,
  deletePatient,
  getAllPatientsByUserId,
} from "../Redux/patientSlice";
import { fetchUserData } from "../Redux/userSlice";

export default function PatientTable({
  filter,
  searchTerm,
  currentPage,
  entriesPerPage,
  setTotalEntries, // New prop for total entries
  refreshKey,
}) {
  const dispatch = useDispatch();
  const { patients, loading, error, successMessage } = useSelector(
    (state) => state.patient
  );

  console.log("patients", patients);
  const { userId } = useSelector((state) => state.user); // Get userId from userSlice

  useEffect(() => {
    // Fetch all patients by userId when the component is mounted
    dispatch(fetchUserData());
    dispatch(getAllPatientsByUserId(userId));
  }, [dispatch, userId, refreshKey]);

  const filteredResults = patients.filter(
    (item) =>
      (filter === "" || item.patientNumber === filter) &&
      (searchTerm === "" ||
        item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.patientNumber)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) // Convert to string
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredResults.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      dispatch(deletePatient(id));
      dispatch(getAllPatientsByUserId(userId)); // ✅ Fetch latest data
    }
  };

  useEffect(() => {
    // Clear success message after 3 seconds
    dispatch(clearMessage());
  }, [successMessage, dispatch]);

  // Update total entries
  useEffect(() => {
    setTotalEntries(filteredResults.length);
  }, [filteredResults, setTotalEntries]);

  return (
    <div className="w-full">
      {loading && <p>Loading...</p>}
      {successMessage && (
        <div className="bg-green-200 text-green-800 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      <table className="w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-blue-200 h-14 py-10">
          <tr className="text-gray-700 text-sm font-normal leading-normal">
            <th className="py-4 px-6 text-left">Sr. No</th>
            <th className="py-4 px-6 text-left">Patient No</th>
            <th className="py-4 px-6 text-left">Name</th>
            <th className="py-4 px-6 text-left">Test Name</th>
            <th className="py-4 px-6 text-left">Contact No</th>
            <th className="py-4 px-6 text-left">Gender</th>
            <th className="py-4 px-6 text-left">Age</th>
            <th className="py-4 px-6 text-left">Sample Collector</th>
            <th className="py-4 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentEntries.map((patient, index) => (
            <tr
              key={patient.id}
              className={`text-gray-700 text-sm font-normal leading-normal ${
                index % 2 === 0
                  ? "bg-gray-100"
                  : "bg-white border-b border-t border-gray-300"
              }`}
            >
              <td className="py-4 px-6 text-left">{index + 1}</td>
              <td className="py-4 px-6 text-left">{patient.patientNumber}</td>
              <td className="py-4 px-6 text-left text-blue-600 underline">
                <Link to={`/Dashboard/PatientDetails/${patient.id}`}>
                  {patient.firstName} {patient.lastName}
                </Link>
              </td>
              <td className="py-4 px-6 text-left">{patient.tests.length}</td>
              <td className="py-4 px-6 text-left">{patient.contactNumber}</td>
              <td className="py-4 px-6 text-left">{patient.gender}</td>
              <td className="py-4 px-6 text-left">{patient.age}</td>
              <td className="py-4 px-6 text-left">{patient.sampleCollector}</td>
              <td className="py-4 px-6 text-left flex gap-2">
                <Link to={`/Dashboard/EditPatient/${patient.id}`}>
                  <button className="text-blue-600">Edit</button>
                </Link>
                <h1>|</h1>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(patient._id || patient.id)}
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
