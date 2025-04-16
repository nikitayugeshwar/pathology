import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useParams } from "react-router";
import Successcard from "../../Components/Successcard";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EditForm = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from URL parameters

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    clinicName: "",
    userName: "",
    password: "",
    dateTime: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/superAdmin/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        // Format dateTime to match input type date format (YYYY-MM-DD)
        const formattedDate = new Date(data.dateTime)
          .toISOString()
          .split("T")[0];
        setFormData({
          ...data,
          dateTime: formattedDate, // Set formatted date
        }); // Populate form with existing user data
      } catch (error) {
        console.error(error);
        // Handle the error (e.g., show a message to the user)
      }
    };

    fetchUserData();
  }, [id]);

  const openSuccess = () => {
    setIsSelectOpen(true);
  };

  const closeSuccess = () => {
    setIsSelectOpen(false);
    navigate("/superAdmin");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true); // Set submitting state to true

    try {
      const response = await fetch(`${BASE_URL}/superAdmin/${id}`, {
        method: "PUT", // Use PUT method for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dateTime: new Date(formData.dateTime).toISOString(), // Format the date if needed
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update superadmin");
      }
      openSuccess(); // Open success card
    } catch (error) {
      console.error(error);
      // Handle the error (e.g., show a message to the user)
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <h1 className="text-lg font-semibold">User Details</h1>
          <div className="w-full grid grid-cols-3 items-center gap-5">
            {/* User Id* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">User Id*</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
                readOnly
                disabled
              />
            </div>

            {/* First Name* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Last Name* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Contact Number* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Contact Number*
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
                pattern="\d{10}" // Ensures exactly 10 digits
                title="Contact number must be exactly 10 digits."
              />
            </div>

            {/* Email* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Clinic Name* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Clinic Name*
              </label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* User Name* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                User Name*
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Password* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Password*
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>

            {/* Date & Time* */}
            <div className="flex flex-col gap-3 w-full">
              <label className="text-lg font-normal text-black">
                Date & Time*
              </label>
              <input
                type="date"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
                required
              />
            </div>
          </div>

          {/* Address* */}
          <div className="flex flex-col gap-3 w-full">
            <label className="text-lg font-normal text-black">Address*</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Type here"
              className="h-20 border border-gray-300 rounded-md w-full py-3 px-5 outline-none"
              required
            ></textarea>
          </div>
        </div>
        <div className="flex gap-5 pb-10">
          <button
            type="submit" // Keep this as a submit button
            className="w-[33%] bg-blue-900 text-white font-medium text-lg p-3 rounded-lg"
          >
            {isSubmitting ? "Updatting..." : "Update"}
          </button>
        </div>
      </form>
      {isSelectOpen && (
        <Successcard
          onClose={closeSuccess}
          para={"User updated successfully"}
        />
      )}
    </div>
  );
};

export default EditForm;
