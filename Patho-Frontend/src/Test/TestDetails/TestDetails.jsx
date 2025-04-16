import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getPatientById } from "../../Redux/patientSlice";

import { BASE_URL } from "../../utils/env"; // Adjust the import path as needed

const TestDetails = () => {
  const { id } = useParams(); // Use parentheses to call useParams
  const patientId = id;
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { patient } = useSelector((state) => state.patient);

  useEffect(() => {
    if (id) {
      dispatch(getPatientById(id)); // Fetch patient details
    }
  }, [dispatch, id]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/getReportByPatientId/${patientId}`
        );
        setReports(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchReports();
    }
  }, [patientId]);

  if (loading) {
    return <p>Loading...</p>; // Show loading message
  }

  if (error) {
    return <p>Error: {error}</p>; // Handle error state
  }

  // Check if patient is loaded and has reports
  return (
    <>
      <div className="px-5 flex items-center justify-between">
        <Link to={"/Dashboard/Test"}>
          <button
            role="button"
            className="flex items-center justify-center gap-2"
          >
            <FaArrowLeftLong className="h-10 w-10 bg-gray-100 rounded-full p-2" />
            <h1 className="text-lg font-semibold">Back</h1>
          </button>
        </Link>

        {/* Buttons */}
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-5 items-center justify-end w-full">
            <Link to={`/Dashboard/CreateTestReport/${id}`}>
              <button
                role="button"
                className="text-white text-sm font-medium bg-blue-900 rounded-md px-5 py-2"
              >
                Create Report
              </button>
            </Link>
            <Link data-testid="edit" to={`/Dashboard/EditTestReport/${id}`}>
              <button
                role="button"
                data-testid="edit"
                className="text-blue-900 border border-blue-900 text-sm font-semibold bg-white rounded-md px-5 py-1.5"
              >
                Edit
              </button>
            </Link>
          </div>
        </div>
      </div>

      {reports.map((report, reportIndex) => (
        <div
          key={report._id}
          className="h-auto w-full flex flex-col p-5 gap-10"
        >
          <div className="w-full flex flex-col rounded-t-xl overflow-hidden">
            <div className="w-full h-12 px-5 flex items-center bg-violet-200">
              <h1 className="text-blue-900 font-semibold">Test Name</h1>
            </div>
            <div className="p-5 w-full h-auto flex flex-col gap-10 border border-gray-300 rounded-b-lg">
              <div className="flex flex-col gap-2 w-full">
                <h1 className="text-gray-400 font-normal text-lg">Test Name</h1>
                <h1 className="text-black font-medium text-lg">
                  {report.testName || "Loading..."}
                </h1>
              </div>

              {/* Render Report Notes */}
              {report.reportNotes && (
                <div className="flex flex-col gap-2 w-full mt-4">
                  <h1 className="text-gray-400 font-normal text-lg">
                    Report Notes
                  </h1>
                  <p className="text-black font-medium text-lg">
                    {report.reportNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <table className="w-full bg-blue-200 rounded-lg overflow-hidden">
              <thead className="w-full bg-blue-200 h-14">
                <tr className="text-gray-700 text-sm font-normal leading-normal">
                  <th className="py-4 px-6 text-left">Field Name</th>
                  <th className="py-4 px-6 text-left">Results</th>
                  <th className="py-4 px-6 text-left">Units</th>
                  <th className="py-4 px-6 text-left">Reference Range</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {/* Iterate through the subtests */}
                {report.subtests.map((subtest, subtestIndex) => (
                  <React.Fragment key={subtestIndex}>
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 px-6 bg-blue-800 bg-opacity-25 text-gray-800 font-semibold"
                      >
                        {subtest.subtestName}
                      </td>
                    </tr>
                    {/* Iterate through fields in each subtest */}
                    {subtest.fields.map((field, fieldIndex) => (
                      <tr
                        key={`${report._id}-${subtestIndex}-${fieldIndex}`}
                        className={`text-gray-700 font-normal leading-normal ${
                          fieldIndex % 2 === 0
                            ? "bg-gray-100"
                            : "bg-white border-b border-t border-gray-300"
                        }`}
                      >
                        <td className="py-4 px-6">{field.fieldName}</td>
                        <td
                          className={`py-4 px-6 ${
                            isOutOfRange(field.results, field.referenceRange)
                              ? "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {field.results}
                        </td>
                        <td className="py-4 px-6">{field.units}</td>
                        <td className="py-4 px-6">{field.referenceRange}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
};

// Helper function to check if a result is out of range
const isOutOfRange = (result, referenceRange) => {
  const [min, max] = referenceRange.split("-").map(Number);
  const numericResult = parseFloat(result);

  if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
    return numericResult < min || numericResult > max;
  }
  return false;
};

export default TestDetails;
