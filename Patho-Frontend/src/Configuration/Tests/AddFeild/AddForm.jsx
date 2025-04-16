import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import hooks
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import Successcard from "../../../Components/Successcard";
import {
  addFieldsToTest,
  clearMessage,
} from "../../../Redux/configTestFeildSlice"; // Adjust the import path

const AddForm = () => {
  const { testId } = useParams(); // Get testId from URL
  const id = testId;
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const { successMessage, error, loading } = useSelector((state) => state.test); // Access loading and success/error messages from state
  const [fields, setFields] = useState([
    { fieldName: "", units: "", referenceRange: "" },
  ]);
  const [isSelectOpen, setisSelectOpen] = useState(false);

  const navigate = useNavigate();

  // Add a new set of fields
  const addField = () => {
    setFields([...fields, { fieldName: "", units: "", referenceRange: "" }]);
  };

  const { userId } = useSelector((state) => state.user);

  // Remove the last set of fields
  const removeField = () => {
    if (fields.length > 1) {
      setFields(fields.slice(0, -1));
    }
  };

  const openSuccess = () => {
    setisSelectOpen(true);
  };

  const closeSuccess = () => {
    setisSelectOpen(false);
    dispatch(clearMessage());
    navigate(`/Dashboard/TestsDetails/${id}`);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    await dispatch(addFieldsToTest({ testId, fields, userId }));
  };

  // Trigger success dialog when successMessage changes
  useEffect(() => {
    if (successMessage) {
      openSuccess();
    }
  }, [successMessage]); // Only call openSuccess when successMessage changes

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col gap-8">
            <div className="w-full grid grid-cols-3 items-center gap-5">
              <div className="flex flex-col gap-3 w-full">
                <label className="text-lg font-normal text-black">
                  Field Name*
                </label>
                <input
                  type="text"
                  name="fieldName"
                  placeholder="Type here"
                  className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                  value={field.fieldName}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].fieldName = e.target.value;
                    setFields(newFields);
                  }}
                  required
                />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <label className="text-lg font-normal text-black">Units*</label>
                <input
                  type="text"
                  name="units"
                  placeholder="Type here"
                  className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                  value={field.units}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].units = e.target.value;
                    setFields(newFields);
                  }}
                  required
                />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <label className="text-lg font-normal text-black">
                  Reference Range*
                </label>
                <input
                  type="text"
                  name="referenceRange"
                  placeholder="Type here"
                  className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                  value={field.referenceRange}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].referenceRange = e.target.value;
                    setFields(newFields);
                  }}
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <div className="w-full flex items-end justify-end">
          <div className="flex gap-5 items-center justify-center">
            <button
              type="button"
              onClick={addField}
              className="text-blue-600 text-lg font-semibold"
            >
              Add New
            </button>
            <button
              type="button"
              onClick={removeField}
              className="text-red-600 text-lg font-semibold"
            >
              Remove
            </button>
          </div>
        </div>

        <div className="flex gap-5 pb-10">
          <button
            type="submit"
            className="w-[33%] bg-blue-900 text-white font-medium text-lg p-3 rounded-lg"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Saving..." : "Save"}{" "}
            {/* Change button text based on loading state */}
          </button>
        </div>
      </form>

      {/* Show success or error messages */}
      {error && <div className="text-red-500">{error}</div>}
      {isSelectOpen && (
        <Successcard onClose={closeSuccess} para={"Tests added successfully"} />
      )}
    </div>
  );
};

export default AddForm;
