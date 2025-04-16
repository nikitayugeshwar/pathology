import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import person1 from "./img/person1.png";

import { BASE_URL } from "../utils/env";
export default function UpperNavbar({ toggleSidebar }) {
  const socket = useRef(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [popupNotification, setPopupNotification] = useState(null);
  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [outOfRangeResults, setOutOfRangeResults] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user`, {
          withCredentials: true,
        });

        if (res.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        const data = res.data.user;

        setUser(data);
        setUserName(data.firstName);
        setSelectedImage(data.profileImage);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, []); // Empty dependency array means it runs once on component mount

  useEffect(() => {
    if (user && user._id) {
      // Only fetch notification count if the user data is available
      const fetchNotificationCount = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/notificationCount`, {
            withCredentials: true,
            params: { userId: user._id }, // Use the user._id here
          });

          console.log("res for count", res);
          if (res.status === 200) {
            setNotificationCount(res.data.count); // Set initial notification count
          }
        } catch (error) {
          console.error("Error fetching notification count:", error);
        }
      };

      fetchNotificationCount();
    }
  }, [user]); // This will run every time `user` is updated

  // Setup WebSocket connection for real-time notifications
  useEffect(() => {
    socket.current = io(`${BASE_URL}`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log("Connected to Socket.io:", socket.current.id);
    });

    socket.current.on("newNotification", (data) => {
      console.log("notification data", data);

      setNotificationCount((prevCount) => prevCount + 1); // Increment notification count
      setPopupNotification(data.description);
    });

    return () => socket.current.disconnect();
  }, []);

  // Handle the notification icon click to reset count
  const handleNotificationIconClick = async () => {
    setNotifications((prevState) => !prevState);

    try {
      // Reset notification count on the server-side by sending the userId
      await axios.post(
        `${BASE_URL}/api/resetNotificationCount`,
        { userId: user._id }, // Pass userId in the request body
        {
          withCredentials: true,
        }
      );

      setNotificationCount(0); // Reset notification count in UI

      // Fetch out-of-range results by userId
      const res = await axios.get(`${BASE_URL}/api/outOfRangeResults`, {
        params: { userId: user._id },
        withCredentials: true,
      });

      if (res.status === 200) {
        setOutOfRangeResults(res.data);
      }
    } catch (error) {
      console.error("Error resetting notification count:", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const closePopupNotification = () => {
    setPopupNotification(null);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      // Display a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Prepare form data for the upload request
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", user._id);

      try {
        const response = await axios.post(
          `${BASE_URL}/api/uploadProfileImage`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.status === 200) {
          setSelectedImage(response.data.profileImage);
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
      {popupNotification && (
        <div className="fixed top-20 right-5 bg-blue-500 w-80 h-auto text-white p-3 rounded-lg shadow-md z-50 flex items-start justify-between">
          <span>{popupNotification}</span>
          <button onClick={closePopupNotification} className="ml-2">
            <span className="text-xl text-red-500 bg-gray-50 bg-opacity-10 hover:bg-gray-200 py-1 px-3 hover:bg-opacity-50 rounded-lg">
              X
            </span>
          </button>
        </div>
      )}
      <div className="h-20 w-full lg:pr-[300px] bg-white px-10 flex items-center justify-between shadow-md fixed">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={toggleSidebar}>
            <FaBars size={25} />
          </button>
          <h1 className="text-xl font-medium">Welcome {userName || "User"}!</h1>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <div className="flex relative">
            <IoMdNotificationsOutline
              size={30}
              className="text-gray-500 cursor-pointer"
              onClick={handleNotificationIconClick}
            />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notificationCount}
              </span>
            )}

            {/* Dropdown for Out-of-Range Results */}
            {notifications &&
              outOfRangeResults &&
              Array.isArray(outOfRangeResults) &&
              outOfRangeResults.length > 0 && (
                <div className="absolute right-0 mt-14 w-80 bg-white border rounded shadow-lg">
                  <ul className="p-2">
                    {outOfRangeResults.map((result, index) => (
                      <li key={index} className="p-2 border-b">
                        <strong>{result.patientName}</strong>
                        <div>
                          {result.tests &&
                            Array.isArray(result.tests) &&
                            result.tests.length > 0 &&
                            result.tests.map((test, idx) => (
                              <div key={idx}>
                                <p>{test.testName}</p>
                                <ul className="ml-4">
                                  {test.testResult &&
                                    Array.isArray(test.testResult) &&
                                    test.testResult.length > 0 &&
                                    test.testResult.map((field, fieldIdx) => (
                                      <li key={fieldIdx} className="text-sm">
                                        <strong>{field.fieldName}:</strong>{" "}
                                        {field.results} {field.units} (Ref:{" "}
                                        {field.referenceRange})
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              <img src={person1} alt="Profile" />
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

function Logout({ onUploadClick, fileInputRef, handleFileChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        dispatch({ type: "user/logout" });
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/");
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
        style={{ display: "none" }}
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
