import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getAllPatientsByUserId } from "../Redux/patientSlice";
import { fetchUserData } from "../Redux/userSlice";

export default function ReportTable() {
  const dispatch = useDispatch();
  const { patients = [] } = useSelector((state) => state.patient || {});

  const { userId = "" } = useSelector((state) => state.user || ""); // Get userId from Redux state

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(getAllPatientsByUserId(userId));
  }, [dispatch, userId]);

  return (
    <div className="w-full">
      <table className="w-full bg-blue-200 rounded-lg overflow-hidden">
        <thead className="w-full bg-blue-200 h-14 py-10">
          <tr className="w-full text-gray-700 text-sm font-normal leading-normal">
            <th className="py-4 px-6 text-left">Sr. No</th>
            <th className="py-4 px-6 text-left">Patient No</th>
            <th className="py-4 px-6 text-left">Name</th>
            <th className="py-4 px-6 text-left">Test Name</th>
            <th className="py-4 px-6 text-left">Contact No</th>
            <th className="py-4 px-6 text-left">Gender</th>
            <th className="py-4 px-6 text-left">Age</th>
            <th className="w-36 py-4 px-6 text-left">Report</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {patients.map((patient, index) => (
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
                <Link to={`/Dashboard/PatientReport/${patient.id}`}>
                  {patient.firstName}
                  {patient.lastName}
                </Link>
              </td>
              <td className="py-4 px-6 text-left">{patient.tests.length}</td>
              <td className="py-4 px-6 text-left">{patient.contactNumber}</td>
              <td className="py-4 px-6 text-left">{patient.gender}</td>
              <td className="py-4 px-6 text-left">{patient.age}</td>
              <td className="py-4 px-6 text-left text-blue-700 underline">
                <Link to={`/Dashboard/ViewReport/${patient.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
