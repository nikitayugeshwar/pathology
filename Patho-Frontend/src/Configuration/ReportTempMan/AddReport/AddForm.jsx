import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Successcard from "../../../Components/Successcard";
import {
  addConfigTemplate,
  resetSuccess,
} from "../../../Redux/configTemplateSlice"; // Adjust the path accordingly
import { getAllTests } from "../../../Redux/configTestSlice";

const AddForm = () => {
  const navigate = useNavigate();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    doctorName: "",
    mobile: "",
    headerName: "",
    subHeaderName: "",
    footer: "",
    logo: null,
    signature1: null,
    signature2: null,
  });
  // State to hold the selected file names
  const [fileNames, setFileNames] = useState({
    logo: "",
    signature1: "",
    signature2: "",
  });

  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);
  const { loading, success, error } = useSelector(
    (state) => state.configTemplate
  );
  const { tests } = useSelector((state) => state.test); // Assuming test slice has 'tests' state

  useEffect(() => {
    dispatch(getAllTests(userId)); // Fetch the test types when the component mounts
  }, [dispatch, userId]);

  const openSuccess = () => {
    setIsSelectOpen(true);
  };

  const closeSuccess = () => {
    setIsSelectOpen(false);
    dispatch(resetSuccess());
    navigate("/Dashboard/ReportTempMan");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Store the file itself
    }));

    // Store the selected file name
    setFileNames((prevNames) => ({
      ...prevNames,
      [name]: files[0]?.name || "", // Store the file name or empty if no file selected
    }));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log("📤 Uploading file:", file.name);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        // Replace with actual upload API
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("✅ File Upload Response:", data);
      return data.fileUrl; // URL of the uploaded file
    } catch (error) {
      console.error("❌ File Upload Error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload files first and get their URLs
    const logoUrl = formData.logo ? await uploadFile(formData.logo) : null;
    const signature1Url = formData.signature1
      ? await uploadFile(formData.signature1)
      : null;
    const signature2Url = formData.signature2
      ? await uploadFile(formData.signature2)
      : null;

    const dataToSend = {
      clinicName: formData.clinicName,
      doctorName: formData.doctorName,
      mobile: formData.mobile,
      headerName: formData.headerName,
      subHeaderName: formData.subHeaderName,
      footer: formData.footer,
      logo: logoUrl, // Send file URL instead of file
      signature1: signature1Url,
      signature2: signature2Url,
      userId: userId,
    };

    console.log("📤 Sending data to GraphQL:", dataToSend);

    const res = await dispatch(addConfigTemplate(dataToSend));
    console.log("Response from GraphQL:", res);

    openSuccess();
  };

  return (
    <div>
      <form
        action="#"
        className="flex flex-col gap-10 pb-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5">
          <div className="w-full grid grid-cols-3 items-center gap-5">
            {/* Clinic Name* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Clinic Name*
              </label>
              <input
                type="text"
                name="clinicName"
                placeholder="Type here"
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
                onChange={handleInputChange}
              />
            </div>

            {/* Doctor Name* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Doctor Name*
              </label>
              <input
                type="text"
                name="doctorName"
                placeholder="Type here"
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
                onChange={handleInputChange}
              />
            </div>

            {/* Upload Logo* */}
            <div className="flex flex-col gap-3 w-full">
              <h1 className="text-lg font-normal text-black">Upload Logo*</h1>
              <label
                htmlFor="logo-upload"
                className="text-lg text-blue-400 w-full py-3 border-dashed border-2 border-blue-400 rounded-md font-semibold text-center"
              >
                Upload logo
              </label>
              <input
                id="logo-upload"
                type="file"
                name="logo"
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Display the selected file name */}
              {fileNames.logo && <p>Selected file: {fileNames.logo}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">
              Mobile Number*
            </label>
            <input
              type="mobile"
              name="mobile"
              placeholder="Type here"
              className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              required
              minLength={10}
              maxLength={10}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">
              Create Header Name*
            </label>
            <input
              type="text"
              name="headerName"
              placeholder="Type here"
              className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">
              Create Sub Header Name*
            </label>
            <input
              type="text"
              name="subHeaderName"
              placeholder="Type here"
              className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">
              Create Footer*
            </label>
            <input
              type="text"
              name="footer"
              placeholder="Type here"
              className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              required
              onChange={handleInputChange}
            />
          </div>

          {/* Upload Files */}
          <div className="w-full grid grid-cols-3 items-center gap-5">
            {/* Upload Signature 1* */}
            <div className="flex flex-col gap-3 w-full">
              <h1 className="text-lg font-normal text-black">
                Upload Signature*
              </h1>
              <label
                htmlFor="signature-upload-1"
                className="text-lg text-blue-400 w-full py-3 border-dashed border-2 border-blue-400 rounded-md font-semibold text-center"
              >
                Upload Signature
              </label>
              <input
                id="signature-upload-1"
                type="file"
                name="signature1"
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Display the selected file name */}
              {fileNames.signature1 && (
                <p>Selected file: {fileNames.signature1}</p>
              )}
            </div>

            {/* Upload Signature 2* */}
            <div className="flex flex-col gap-3 w-full">
              <h1 className="text-lg font-normal text-black">
                Upload Signature*
              </h1>
              <label
                htmlFor="signature-upload-2"
                className="text-lg text-blue-400 w-full py-3 border-dashed border-2 border-blue-400 rounded-md font-semibold text-center"
              >
                Upload Signature
              </label>
              <input
                id="signature-upload-2"
                type="file"
                name="signature2"
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Display the selected file name */}
              {fileNames.signature2 && (
                <p>Selected file: {fileNames.signature2}</p>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-5 w-[33%] rounded-md"
          disabled={loading} // Disable button when loading
        >
          {loading ? "Submitting..." : "Submit"} {/* Show loading state */}
        </button>
        {isSelectOpen && (
          <Successcard
            onClose={closeSuccess}
            para={"Report Added Successfully!"}
          />
        )}
      </form>
    </div>
  );
};

export default AddForm;
