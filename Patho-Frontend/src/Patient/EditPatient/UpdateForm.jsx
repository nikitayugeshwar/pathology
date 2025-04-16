import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Successcard from "../../Components/Successcard";
import { getAllTests } from "../../Redux/configTestSlice";
import { clearMessage, updatePatient } from "../../Redux/patientSlice";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // Format for datetime-local input
};

const UpdateForm = ({ patientId, existingPatientData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMessage } = useSelector(
    (state) => state.patient
  );
  const { tests = [] } = useSelector((state) => state.test);
  const { userId } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    patientNumber: "",
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

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const openSuccess = () => {
    setIsSelectOpen(true);
    dispatch(clearMessage());
  };

  const testOptions = tests.map((test) => ({
    label: test.testName,
    value: test._id,
  }));

  // Fetch tests when the component mounts
  // useEffect(() => {
  //   dispatch(getAllTests(userId));
  //   if (existingPatientData) {
  //     setFormData({
  //       ...existingPatientData,
  //       dateTime: formatDateForInput(existingPatientData.dateTime),
  //       selectedTests: existingPatientData.selectedTests || [], // Set existing selected tests
  //     });
  //   }
  // }, [dispatch, existingPatientData, userId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestSelect = (selectedOptions) => {
    const selectedTests = selectedOptions.map((option) => ({
      name: option.label,
      id: option.value,
    }));
    setFormData({ ...formData, tests: selectedTests });
  };

  useEffect(() => {
    dispatch(getAllTests(userId));
    if (existingPatientData) {
      setFormData({
        patientNumber: existingPatientData.patientNumber || "",
        firstName: existingPatientData.firstName || "",
        lastName: existingPatientData.lastName || "",
        contactNumber: existingPatientData.contactNumber || "",
        email: existingPatientData.email || "",
        gender: existingPatientData.gender || "",
        age: existingPatientData.age || "",
        sampleCollector: existingPatientData.sampleCollector || "",
        dateTime: formatDateForInput(existingPatientData.dateTime),
        doctorName: existingPatientData.doctorName || "",
        collectAt: existingPatientData.collectAt || "",
        address: existingPatientData.address || "",
        tests:
          existingPatientData.tests?.map((test) => ({
            id: test.id,
            name: test.name,
          })) || [],
        userId: existingPatientData.userId || userId,
      });
    }
  }, [dispatch, existingPatientData, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patientData = {
      ...formData,
      age: parseInt(formData.age, 10), // Ensure age is an integer
      tests: formData.tests.map((test) => ({
        name: test.name,
        id: String(test.id), // Ensure test ID is a string
      })),
      userId: String(userId), // Ensure user ID is a string
    };

    try {
      await dispatch(updatePatient({ id: patientId, patientData })).unwrap();
      setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
    } catch (err) {
      const errorMessage =
        err?.message || err?.data?.message || "Something went wrong.";
      if (errorMessage.includes("Patient with this number")) {
        alert(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  const closeSuccess = () => {
    setIsSelectOpen(false);
    navigate("/Dashboard/Patient");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <h1 className="text-lg font-semibold">Update Patient Details</h1>
          <div className="w-full grid grid-cols-3 items-start gap-5">
            {/* Patient Number */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Patient Number*
              </label>
              <input
                type="text"
                name="patientNumber"
                value={formData.patientNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* First Name */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                First Name*
              </label>
              <input
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
              <label className="text-lg font-normal text-black">
                Last Name*
              </label>
              <input
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
              <label className="text-lg font-normal text-black">
                Contact Number*
              </label>
              <input
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
              <label className="text-lg font-normal text-black">Email*</label>
              <input
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
              <label className="text-lg font-normal text-black">Gender*</label>
              <select
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
              <label className="text-lg font-normal text-black">Age*</label>
              <input
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
              <label className="text-lg font-normal text-black">
                Sample Collector*
              </label>
              <input
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
              <label className="text-lg font-normal text-black">
                Date & Time*
              </label>
              <input
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
              <label className="text-lg font-normal text-black">
                Doctor Name*
              </label>
              <input
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
              <label className="text-lg font-normal text-black">
                Collection Date *
              </label>
              <input
                type="date"
                name="collectAt"
                value={formData.collectAt}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Test Selection */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Test Name*
              </label>
              <Select
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
              <label className="text-lg font-normal text-black">Address*</label>
              <input
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
              {loading ? "Updating..." : "Update"}
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

export default UpdateForm;
