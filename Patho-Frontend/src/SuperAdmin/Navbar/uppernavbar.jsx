import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import noti from "./img/notification.png";
import { BASE_URL } from "../../utils/env";

export default function UpperNavbar({ toggleSidebar }) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [userName, setUserName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
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
        // console.log("data", data);

        setUser(data);
        setSelectedImage(data.profileImage);
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Preview the selected image
      };
      reader.readAsDataURL(file);

      // Prepare form data for the upload request
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", user._id);

      try {
        const response = await axios.post(
          `${BASE_URL}/superAdminAuth/uploadProfileImage`,
          formData,
          { withCredentials: true }
        );

        if (response.status === 200) {
          console.log("Image uploaded successfully:", response.data);
          // Update the profile image in state if necessary
          setSelectedImage(response.data.profileImage); // Update with the image returned from the server
        } else {
          console.error("Error uploading image:", response.data);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="w-full relative h-20 bg-white z-30">
      <div className="h-20 w-full lg:pr-[300px] bg-white px-10 flex items-center justify-between shadow-md fixed">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={toggleSidebar}>
            <FaBars size={25} />
          </button>
          <h1 className="text-xl font-medium">Welcome {userName || "User"}!</h1>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <div className="flex flex-row gap-1 relative">
            <h1 className="absolute text-xs right-1 top-[2px]">
              {notificationCount}
            </h1>
            <img src={noti} alt="Notification" className="h-10 w-8" />
          </div>
          <div
            className="flex gap-5 items-center justify-center cursor-pointer"
            onClick={() => setIsLogoutOpen(!isLogoutOpen)}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <img src="./img/person1.png" alt="Profile" />
            )}
            <h1 className="text-xl font-medium">{userName || "User"}</h1>
            <IoIosArrowDown size={25} />
          </div>
          <div className="relative">
            {isLogoutOpen && (
              <Logout
                onUploadClick={handleUploadClick}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Logout Component
function Logout({ onUploadClick, fileInputRef, handleFileChange }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/superAdminAuth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/SuperAdminLogin");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="absolute w-48 right-10 top-10 bg-white border rounded-lg shadow-lg p-3">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }} // Keep it hidden
        onChange={handleFileChange}
        accept="image/*"
      />
      <div
        className="flex gap-5 cursor-pointer items-center justify-center text-center p-3 hover:bg-gray-100"
        onClick={onUploadClick}
      >
        <h1 className="w-full text-center">Upload Picture</h1>
      </div>
      <button
        onClick={handleLogout}
        className="w-full py-3 text-center hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
}
