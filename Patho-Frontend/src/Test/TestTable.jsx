import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearMessage, getAllPatientsByUserId } from "../Redux/patientSlice";
import { fetchUserData } from "../Redux/userSlice";

export default function TestTable({
  filter,
  searchTerm,
  currentPage,
  entriesPerPage,
  setTestCount,
  setTotalEntries, // New prop for total entries
  refreshKey,
}) {
  const dispatch = useDispatch();

  const { patients, loading, error, successMessage } = useSelector(
    (state) => state.patient
  );

  const { userId = "" } = useSelector((state) => state.user || ""); // Get userId from Redux state

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserData());
      dispatch(getAllPatientsByUserId(userId));
    } else {
      console.error("User ID is undefined or null.");
    }
  }, [dispatch, userId, refreshKey]);

  useEffect(() => {
    dispatch(clearMessage()); // Clears error globally for the component
  }, [dispatch]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <>
      <div className="w-full">
        <table className="w-full bg-blue-200 rounded-lg overflow-hidden">
          <thead className="w-full bg-blue-200 h-14 py-10">
            <tr className="w-full text-gray-700 text-sm font-normal leading-normal">
              <th className="py-4 px-6 text-left">Sr. No</th>
              <th className="py-4 px-6  text-left">Patient No</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Test Name</th>
              <th className="py-4 px-6 text-left">Contact No</th>
              <th className="py-4 px-6 text-left">Gender</th>
              <th className="py-4 px-6 text-left">Age</th>
              <th className="py-4 px-6 text-left">Sample Collector</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentEntries.map((patient, index) => (
              <tr
                key={index}
                className={`text-gray-700 text-sm font-normal leading-normal ${
                  index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white border-b border-t border-gray-300"
                }`}
              >
                <td className="py-4 px-6 text-left">{index + 1}</td>
                <td className="py-4 px-6 text-left">{patient.patientNumber}</td>
                <td className="py-4 px-6 text-left text-blue-700 underline">
                  <Link to={`/Dashboard/PatientTestDetails/${patient.id}`}>
                    {patient.firstName} {patient.lastName}
                  </Link>
                </td>
                <td className="py-4 px-6 text-left text-blue-700 underline">
                  <Link to={`/Dashboard/TestDetails/${patient.id}`}>
                    {patient.tests.length}
                  </Link>
                </td>
                <td className="py-4 px-6 text-left">{patient.contactNumber}</td>
                <td className="py-4 px-6 text-left">{patient.gender}</td>
                <td className="py-4 px-6 text-left">{patient.age}</td>
                <td className="py-4 px-6 text-left">
                  {patient.sampleCollector}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
