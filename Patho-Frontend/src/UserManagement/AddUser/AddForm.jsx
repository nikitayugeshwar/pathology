import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Successcard from "../../Components/Successcard";

import { BASE_URL } from "../../utils/env";

const AddForm = () => {
  const [isSelectOpen, setisSelectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/superAdminAuth/user`, {
          withCredentials: true,
        });

        if (res.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        const data = res.data.user;
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const openSuccess = () => {
    setisSelectOpen(true);
  };

  const closeSuccess = () => {
    setisSelectOpen(false);
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
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/superAdmin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dateTime: new Date(formData.dateTime).toISOString(),
          superAdminId: user._id, // Send superAdminId to the backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        return;
      }

      openSuccess();
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <h1 className="text-lg font-semibold">Student Details</h1>
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
                pattern="[0-9]{10}"
                title="Contact number must be exactly 10 digits."
                minLength={10}
                maxLength={10}
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
            type="submit"
            className="w-[33%] bg-blue-900 text-white font-medium text-lg p-3 rounded-lg"
          >
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </form>

      {isSelectOpen && (
        <Successcard onClose={closeSuccess} para={"User added successfully"} />
      )}
    </div>
  );
};

export default AddForm;
