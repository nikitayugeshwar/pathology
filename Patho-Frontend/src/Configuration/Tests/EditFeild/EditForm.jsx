import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Successcard from "../../../Components/Successcard";
import {
  clearMessage,
  getFieldsByTestId,
  updateFieldsByTestId,
} from "../../../Redux/configTestFeildSlice";

const EditForm = () => {
  const { testId } = useParams();
  const id = testId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get fields, loading, success, and error from Redux state
  const { successMessage, error, loading } = useSelector((state) => state.test);

  const [fields, setFields] = useState([]); // Local state to hold field values
  const [isSelectOpen, setIsSelectOpen] = useState(false); // State for success message visibility

  // Fetch existing fields on component load
  useEffect(() => {
    const fetchFields = async () => {
      const res = await dispatch(getFieldsByTestId(testId)); // Fetch fields by testId
      if (res.payload && res.payload) {
        setFields(res.payload); // Set fields from the response
      } else {
        setFields([]); // Fallback if no fields are returned
      }
    };
    fetchFields();
  }, [dispatch, testId]);

  // Open success dialog
  const openSuccess = () => {
    setIsSelectOpen(true);
  };

  // Close success dialog and navigate back
  const closeSuccess = () => {
    setIsSelectOpen(false);
    navigate(`/Dashboard/TestsDetails/${id}`);
    dispatch(clearMessage());
  };

  // Handle adding a new field
  const addField = () => {
    setFields([...fields, { fieldName: "", units: "", referenceRange: "" }]);
  };

  // Handle removing the last field
  const removeField = () => {
    if (fields.length > 1) {
      setFields(fields.slice(0, -1));
    }
  };

  // Handle field change
  const handleFieldChange = (index, name, value) => {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index] = { ...newFields[index], [name]: value }; // Create a new object with updated property
      return newFields; // Return the updated fields array
    });
  };

  // Handle form submission to update the fields
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    // Check if form is valid before continuing (HTML5 validation)
    if (!form.checkValidity()) {
      form.reportValidity(); // This will trigger the native HTML5 validation messages
      return;
    }

    // Submit the form if all validation checks pass
    const res = await dispatch(updateFieldsByTestId({ testId, fields }));
    if (res.meta.requestStatus === "fulfilled") {
      openSuccess(); // Open success dialog on successful update
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
        {" "}
        {/* noValidate disables native form validation so we handle it manually */}
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col gap-8">
            <div className="w-full grid grid-cols-3 items-center gap-5">
              {/* Field Name */}
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
                  onChange={(e) =>
                    handleFieldChange(index, "fieldName", e.target.value)
                  }
                  required
                />
              </div>

              {/* Units */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-lg font-normal text-black">Units*</label>
                <input
                  type="text"
                  name="units"
                  placeholder="Type here"
                  className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                  value={field.units}
                  onChange={(e) =>
                    handleFieldChange(index, "units", e.target.value)
                  }
                  required
                />
              </div>

              {/* Reference Range */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-lg font-normal text-black">
                  Reference Range*
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  name="referenceRange"
                  className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                  value={field.referenceRange}
                  onChange={(e) =>
                    handleFieldChange(index, "referenceRange", e.target.value)
                  }
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
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>

      {/* Success or Error Handling */}
      {error && <div className="text-red-500">{error}</div>}
      {isSelectOpen && (
        <Successcard
          onClose={closeSuccess}
          para={"Fields updated successfully"}
        />
      )}
    </div>
  );
};

export default EditForm;
