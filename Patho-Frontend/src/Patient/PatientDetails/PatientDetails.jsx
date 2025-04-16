import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clearMessage, getPatientById } from "../../Redux/patientSlice"; // Assume this action exists

const PatientDetails = () => {
  const { id } = useParams(); // Get patient ID from the URL
  const dispatch = useDispatch();
  const { patient, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    if (id) {
      dispatch(getPatientById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(clearMessage()); // Clears error globally for the component
  }, [dispatch]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} | ${hours}:${minutes}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading patient details: {error}</p>;

  return (
    <>
      <div className="h-screen w-full flex flex-col p-5 gap-10">
        <div className="flex w-full justify-between items-center">
          <Link to={"/Dashboard/Patient"}>
            <button className="flex items-center justify-center gap-2">
              <FaArrowLeftLong className="h-10 w-10 bg-gray-100 rounded-full p-2" />
              <h1 className="text-lg font-semibold">Back</h1>
            </button>
          </Link>
        </div>

        <div className="w-full flex flex-col rounded-t-xl overflow-hidden">
          <div className="w-full h-12 px-5 flex items-center bg-blue-200">
            <h1 className="text-blue-600 font-semibold">
              {patient.firstName} {patient.lastName}
            </h1>
          </div>

          <div className="p-5 w-full h-auto flex flex-col gap-10 border border-gray-300 rounded-b-lg">
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-gray-400 font-normal text-lg">
                  Patient Number
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">
                  First Name
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">Last Name</h1>
                <h1 className="text-gray-400 font-normal text-lg">
                  Contact Number
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">Email</h1>
              </div>
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-black font-medium text-lg">
                  {patient.patientNumber}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {patient.firstName}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {patient.lastName}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {patient.contactNumber}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {patient.email}
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-gray-400 font-normal text-lg">Gender</h1>
                <h1 className="text-gray-400 font-normal text-lg">Age</h1>
                <h1 className="text-gray-400 font-normal text-lg">
                  Sample Collector
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">
                  Date & Time
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">
                  Doctor Name
                </h1>
              </div>
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-black font-medium text-lg">
                  {patient.gender}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {patient.age}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {patient.sampleCollector}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {formatDateTime(patient.dateTime)}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {patient.doctorName}
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-gray-400 font-normal text-lg">
                  Collect at
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">Test Name</h1>
                <h1 className="text-gray-400 font-normal text-lg">Address</h1>
              </div>
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-black font-medium text-lg">
                  {patient.collectAt}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  <h1 className="text-black font-medium text-lg">
                    {patient.tests &&
                      patient.tests.map((test) => test.name).join(", ")}
                  </h1>

                  {/* Join test names with comma if multiple */}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {patient.address}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDetails;
