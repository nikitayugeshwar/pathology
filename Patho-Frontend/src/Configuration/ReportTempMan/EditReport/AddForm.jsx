import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Successcard from "../../../Components/Successcard";
import {
  getConfigTemplateById,
  resetSuccess,
  updateConfigTemplate,
} from "../../../Redux/configTemplateSlice";
import { getAllTests } from "../../../Redux/configTestSlice";

const AddForm = () => {
  const { id } = useParams();
  const templateId = id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { configTemplate, loading, success } = useSelector(
    (state) => state.configTemplate
  );

  const [formData, setFormData] = useState({
    testType: "",
    clinicName: "",
    doctorName: "",
    mobile: "",
    headerName: "",
    subHeaderName: "",
    footer: "",
  });

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { userId } = useSelector((state) => state.user);

  const { tests } = useSelector((state) => state.test); // Assuming test slice has 'tests' state

  useEffect(() => {
    dispatch(getAllTests(userId)); // Fetch the test types when the component mounts
  }, [dispatch, userId]);

  useEffect(() => {
    if (templateId) {
      dispatch(getConfigTemplateById(templateId));
    }
  }, [dispatch, templateId]);

  useEffect(() => {
    if (configTemplate) {
      // Set initial form data from fetched configTemplate
      setFormData({
        testType: configTemplate.testType || "",
        clinicName: configTemplate.clinicName || "",
        doctorName: configTemplate.doctorName || "",
        mobile: configTemplate.mobile || "",
        headerName: configTemplate.headerName || "",
        subHeaderName: configTemplate.subHeaderName || "",
        footer: configTemplate.footer || "",
      });
    }
  }, [configTemplate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // Handle file upload separately if needed
      setFormData((prev) => ({ ...prev, [name]: files[0] })); // Set file directly
    } else {
      setFormData((prev) => ({ ...prev, [name]: value })); // Update text input values
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the input object for the update mutation
    const input = {
      clinicName: formData.clinicName,
      doctorName: formData.doctorName,
      mobile: formData.mobile,
      headerName: formData.headerName,
      subHeaderName: formData.subHeaderName,
      footer: formData.footer,
      userId: userId, // Ensure userId is included
      logo: formData.logo ? await uploadFile(formData.logo) : null,
      signature1: formData.signature1
        ? await uploadFile(formData.signature1)
        : null,
      signature2: formData.signature2
        ? await uploadFile(formData.signature2)
        : null,
    };

    console.log("📤 Submitting update for template ID:", templateId);
    console.log("📄 Data being sent:", input);

    dispatch(updateConfigTemplate({ id: templateId, input }));

    openSuccess();
  };

  const openSuccess = () => {
    setIsSelectOpen(true);
  };

  const closeSuccess = () => {
    setIsSelectOpen(false);
    dispatch(resetSuccess());
    navigate("/Dashboard/ReportTempMan");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <div className="w-full grid grid-cols-3 items-center gap-5">
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Clinic Name*
              </label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                placeholder="Type here"
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Doctor Name*
              </label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Type here"
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <h1 className="text-lg font-normal text-black">Upload Logo*</h1>
              <label
                htmlFor="file-upload-logo"
                className="text-lg text-blue-400 w-full py-3 border-dashed border-2 border-blue-400 rounded-md font-semibold text-center"
              >
                Upload logo
              </label>
              <input
                id="file-upload-logo"
                type="file"
                name="logo"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">
              Mobile Number*
            </label>
            <input
              type="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Type here"
              className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              minLength={10}
              maxLength={10}
              required
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">
              Create Header Name*
            </label>
            <input
              type="text"
              name="headerName"
              value={formData.headerName}
              onChange={handleChange}
              placeholder="Type here"
              className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">
              Create Sub Header Name*
            </label>
            <input
              type="text"
              name="subHeaderName"
              value={formData.subHeaderName}
              onChange={handleChange}
              placeholder="Type here"
              className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">
              Create Footer*
            </label>
            <input
              type="text"
              name="footer"
              value={formData.footer}
              onChange={handleChange}
              placeholder="Type here"
              className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              required
            />
          </div>

          <div className="w-full grid grid-cols-3 items-center gap-5">
            <div className="flex flex-col gap-3 w-full">
              <h1 className="text-lg font-normal text-black">
                Upload Signature 1*
              </h1>
              <label
                htmlFor="file-upload-signature1"
                className="text-lg text-blue-400 w-full py-3 border-dashed border-2 border-blue-400 rounded-md font-semibold text-center"
              >
                Upload Signature
              </label>
              <input
                id="file-upload-signature1"
                type="file"
                name="signature1"
                onChange={handleChange}
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <h1 className="text-lg font-normal text-black">
                Upload Signature 2*
              </h1>
              <label
                htmlFor="file-upload-signature2"
                className="text-lg text-blue-400 w-full py-3 border-dashed border-2 border-blue-400 rounded-md font-semibold text-center"
              >
                Upload Signature
              </label>
              <input
                id="file-upload-signature2"
                type="file"
                name="signature2"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-5 pb-10">
          <button
            type="submit"
            className="w-[33%] bg-blue-900 text-white font-medium text-lg p-3 rounded-lg"
          >
            Update
          </button>
        </div>
      </form>
      {isSelectOpen && (
        <Successcard
          onClose={closeSuccess}
          para={"Report template updated successfully"}
        />
      )}
    </div>
  );
};

export default AddForm;
