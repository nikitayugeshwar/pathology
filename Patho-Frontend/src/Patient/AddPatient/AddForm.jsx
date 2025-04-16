import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; // Import react-select
import Successcard from "../../Components/Successcard";
import { getAllTests } from "../../Redux/configTestSlice";
import { addPatient, clearMessage } from "../../Redux/patientSlice";
import { fetchUserData } from "../../Redux/userSlice";

const AddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMessage } = useSelector(
    (state) => state.patient
  );
  const { tests = [] } = useSelector((state) => state.test);
  const { userId } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    gender: "",
    age: "",
    sampleCollector: "",
    dateTime: "",
    doctorName: "",
    collectAt: "",
    tests: [],
    address: "",
    userId: "",
  });

  useEffect(() => {
    dispatch(getAllTests(userId));
    dispatch(fetchUserData());
  }, [dispatch, userId]);

  useEffect(() => {
    // Clear success message after 3 seconds
    dispatch(clearMessage());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle test selection change
  const handleTestSelect = (selectedOptions) => {
    const selectedTests = selectedOptions.map((option) => ({
      name: option.label,
      id: option.value,
    }));

    console.log("selected optios ", selectedOptions);
    setFormData({ ...formData, tests: selectedTests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      age: parseInt(formData.age, 10), // Ensure age is an integer
      tests: formData.tests.map((test) => ({
        name: test.name,
        id: String(test.id), // Ensure test ID is a string
      })),
      userId: String(userId), // Ensure user ID is a string
    };

    console.log(
      "🚀 Sending Data to GraphQL:",
      JSON.stringify(formattedData, null, 2)
    );

    try {
      await dispatch(addPatient(formattedData)).unwrap();

      console.log("sucess meaage", successMessage);
      setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
    } catch (err) {
      console.error("❌ Error Adding Patient:", err);
    }
  };

  const closeSuccess = () => {
    navigate("/Dashboard/Patient");
  };

  // Convert tests from Redux store to react-select options
  const testOptions = tests.map((test) => ({
    label: test.testName,
    value: test.id,
  }));

  return (
    <div>
      <form
        role="form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-10"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-lg font-semibold">Patient Details</h1>
          <div className="w-full grid grid-cols-3 items-start gap-5">
            {/* First Name */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="contactNumber"
              >
                Contact Number*
              </label>
              <input
                id="contactNumber"
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    handleInputChange(e);
                  }
                }}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                maxLength={10}
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black" htmlFor="email">
                Email*
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="gender"
              >
                Gender*
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black" htmlFor="age">
                Age*
              </label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                min={1}
                max={120}
                required
              />
            </div>

            {/* Sample Collector */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="sampleCollector"
              >
                Sample Collector*
              </label>
              <input
                id="sampleCollector"
                type="text"
                name="sampleCollector"
                value={formData.sampleCollector}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Date & Time */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="datetime"
              >
                Date & Time*
              </label>
              <input
                id="datetime"
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Doctor Name */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="Doctorname"
              >
                Doctor Name*
              </label>
              <input
                id="Doctorname"
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Collect At */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="collectionDate"
              >
                Collection Date*
              </label>
              <input
                id="collectionDate"
                type="date"
                name="collectAt"
                value={formData.collectAt}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Test Selection using react-select */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="Testname"
              >
                Test Name*
              </label>
              <Select
                id="Testname"
                options={testOptions}
                isMulti
                value={formData.tests.map((test) => ({
                  label: test.name,
                  value: test.id,
                }))}
                onChange={handleTestSelect}
                className="w-full"
                placeholder="Select Test(s)"
                required
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-3 w-full">
              <label
                className="text-lg font-normal text-black"
                htmlFor="address"
              >
                Address*
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-5 pb-10">
            <button
              type="submit"
              className="w-32 bg-blue-900 text-white font-medium text-lg p-3 rounded-lg"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && (
        <Successcard onClose={closeSuccess} para={successMessage} />
      )}
    </div>
  );
};

export default AddForm;
