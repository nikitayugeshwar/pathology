import axios from "axios";
import React, { useEffect, useState } from "react";
import ReportTable from "./ReportTable";
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const Tests = ({ id, patientId }) => {
  const [test, setTest] = useState();

  useEffect(() => {
    const getTestById = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/getTestById/${id}`,
          { patientId } // Payload
        );
        console.log("response in testdetails", response);
        setTest(response.data.test);
      } catch (error) {
        console.error("Error fetching test details", error);
      }
    };

    getTestById();
  }, [id, patientId]);

  return (
    <>
      <div className="h-auto   w-full flex flex-col p-5 gap-10">
        {/*  */}
        <div className="w-full flex flex-col rounded-t-xl overflow-hidden">
          <div className="w-full h-12 px-5 flex items-center bg-violet-200">
            <h1 className="text-blue-900 font-semibold ">Test Name</h1>
          </div>
          <div className="p-5 w-full h-auto flex flex-col gap-10 border border-gray-300 rounded-b-lg">
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-gray-400 font-normal text-lg">Test Name</h1>
              <h1 className="text-black font-medium text-lg">
                {test?.testName || "Loading..."}
              </h1>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <ReportTable testId={id} />
      </div>
    </>
  );
};

export default Tests;
