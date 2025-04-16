import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Sidenavbar from "./Navbar/sidenavbar.jsx";
import Uppernavbar from "./Navbar/uppernavbar.jsx";
import { useDispatch } from "react-redux";
import { fetchUserData } from "./Redux/userSlice.js";
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/dashboard`, {
          withCredentials: true, // Important to send cookies
        });
      } catch (error) {
        // If access token is expired, attempt to refresh it
        if (error.response && error.response.status === 401) {
          await refreshAccessToken();
        } else {
          setIsLoggedIn(false);
          navigate("/"); // Redirect to login page if not logged in
        }
      }
    };

    const refreshAccessToken = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/refresh-token`,
          {},
          {
            withCredentials: true, // Important to send cookies
          }
        );

        // After refreshing, check for valid dashboard access again
        await checkAuth();
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
        setIsLoggedIn(false);
        navigate("/"); // Redirect to login page if refresh fails
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isLoggedIn) {
    return <div>Logging out...</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div className="flex">
        <Sidenavbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1">
          <Uppernavbar toggleSidebar={toggleSidebar} />
          <div className="p-5 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
