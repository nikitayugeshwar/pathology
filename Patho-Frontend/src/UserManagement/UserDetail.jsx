import React, { useEffect, useState } from "react"; // Added useRef
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

import { BASE_URL } from "../utils/env"; // Adjust the import path

const UserDetail = () => {
  const { id } = useParams(); // Extracting the user ID from the URL
  const [userData, setUserData] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isUserActive, setIsUserActive] = useState(false);

  // Fetch user data by ID when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/superAdmin/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("data in super admin", data);
        setUserData(data);
        setIsUserActive(data.active); // Set initial user active status
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Function to toggle user active status
  const toggleUserStatus = async () => {
    const newActiveStatus = !isUserActive;
    try {
      const response = await fetch(
        `${BASE_URL}/superAdmin/update-active/${id}`, // Updated URL
        {
          method: "PATCH", // PATCH method for updating active status
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active: newActiveStatus }), // Update the active status
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const updatedData = await response.json(); // Get the response data if needed
      console.log(updatedData.message); // Log success message

      setIsUserActive(newActiveStatus); // Update local state
      closeSuccess(); // Close the confirmation dialog
    } catch (error) {
      console.error("Error updating user status:", error);
      // Optionally, show an error message to the user
    }
  };

  const openSuccess = () => {
    setIsSelectOpen(true);
  };

  const closeSuccess = () => {
    setIsSelectOpen(false);
  };

  // Render loading state or user details
  if (!userData) {
    return <div>Loading user details...</div>;
  }

  return (
    <>
      <div className="h-screen w-full flex flex-col p-5 gap-10">
        {/* Buttons */}
        <div className="flex w-full justify-between items-center">
          <Link to={"/superAdmin"}>
            <button className="flex items-center justify-center gap-2">
              <FaArrowLeftLong className="h-10 w-10 bg-gray-100 rounded-full p-2" />
              <h1 className="text-lg font-semibold">Back</h1>
            </button>
          </Link>

          <div
            onClick={openSuccess}
            className="flex cursor-pointer items-center justify-center gap-4"
          >
            <h1 className="text-red-900 font-semibold text-lg">
              {isUserActive ? "User Deactivate" : "User Activate"}
            </h1>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isUserActive} // Check based on active status
                className="sr-only peer"
                readOnly
              />
              <div
                className={`w-14 h-7 ${
                  isUserActive ? "bg-indigo-900" : "bg-red-600"
                } peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all hover:peer-checked:bg-indigo-700`}
              ></div>
            </label>
            <h1 className="text-gray-800 font-semibold text-lg">
              {isUserActive ? "User Active" : "User Inactive"}
            </h1>
          </div>
        </div>

        {isSelectOpen && (
          <ConfirmationCard
            onClose={closeSuccess}
            para={"Do you really want to change the user status?"}
            onConfirm={toggleUserStatus} // Call the function on confirmation
          />
        )}

        {/* User details */}
        <div className="w-full flex flex-col rounded-t-xl overflow-hidden">
          <div className="w-full h-12 px-5 flex items-center bg-blue-200">
            <h1 className="text-blue-900 font-semibold">{`${userData.firstName} ${userData.lastName}`}</h1>
          </div>

          <div className="p-5 w-full h-auto flex flex-col gap-10 border border-gray-300 rounded-b-lg">
            {/* User details */}
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-gray-400 font-normal text-lg">User Id</h1>
                <h1 className="text-gray-400 font-normal text-lg">
                  First Name
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">Last Name</h1>
                <h1 className="text-gray-400 font-normal text-lg">
                  Contact Number
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">Email</h1>
              </div>
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-black font-medium text-lg">
                  {userData.userId}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {userData.firstName}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {userData.lastName}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {userData.contactNumber}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {userData.email}
                </h1>
              </div>
            </div>

            {/* More user details */}
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-gray-400 font-normal text-lg">
                  Clinic Name
                </h1>
                <h1 className="text-gray-400 font-normal text-lg">User Name</h1>
                <h1 className="text-gray-400 font-normal text-lg">Password</h1>
                <h1 className="text-gray-400 font-normal text-lg">
                  Date & Time
                </h1>
              </div>
              <div className="w-full grid grid-cols-5 items-center justify-between gap-5">
                <h1 className="text-black font-medium text-lg">
                  {userData.clinicName}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {userData.userName}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  {userData.password}
                </h1>
                <h1 className="text-black font-medium text-lg">
                  29-06-24 | 9:00 AM
                </h1>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-gray-400 font-normal text-lg">Address</h1>
              <h1 className="text-black font-medium text-lg">
                {userData.address}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ConfirmationCard component
const ConfirmationCard = ({ onClose, para, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold">Confirmation</h2>
        <p>{para}</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded mr-2"
            onClick={onClose} // Close the dialog without action
          >
            No
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              onConfirm(); // Execute the confirmation action
              onClose(); // Close the dialog
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
