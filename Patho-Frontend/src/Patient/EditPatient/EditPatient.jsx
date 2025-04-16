import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import UpdateForm from "./UpdateForm";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditPatient = () => {
  const { id } = useParams(); // Assume you have a route parameter for the patient ID
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getPatient/${id}`);
        setPatientData(response.data.patient);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch patient data");
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!patientData) return <div>No patient data found.</div>;

  return (
    <>
      <div className="h-screen w-full flex flex-col px-5 py-10 gap-10">
        <div className="w-full">
          <Link to={"/Dashboard/Patient"}>
            <button className="flex items-center justify-center gap-3">
              <FaArrowLeftLong className="h-10 w-10 bg-gray-100 rounded-full p-2" />
              <h1 className="text-lg font-semibold">Back</h1>
            </button>
          </Link>
        </div>

        {/* Update Form */}
        <UpdateForm
          patientId={id} // Use the patient ID from URL
          existingPatientData={patientData} // Pass the fetched patient data
        />
      </div>
    </>
  );
};

export default EditPatient;
