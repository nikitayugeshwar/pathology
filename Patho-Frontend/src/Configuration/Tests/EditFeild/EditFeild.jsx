import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import EditForm from "./EditForm";

const EditFeild = () => {
  const { testId } = useParams();
  const id = testId;

  return (
    <>
      {" "}
      <div className="h-screen w-full flex flex-col px-5 py-10 gap-10">
        <div className="w-full">
          <Link to={`/Dashboard/TestsDetails/${id}`}>
            <button className="flex items-center justify-center gap-3">
              <FaArrowLeftLong className="h-10 w-10 bg-gray-100 rounded-full p-2" />
              <h1 className="text-lg font-semibold">Back</h1>
            </button>
          </Link>
        </div>

        {/* form */}
        <EditForm />
      </div>
    </>
  );
};

export default EditFeild;
