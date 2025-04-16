import axios from "axios";
import React, { useEffect, useState } from "react";
import { ImWhatsapp } from "react-icons/im";
import { MdOutlineMail } from "react-icons/md";
import { SiTwilio } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";

import course from "./course.png";
import user from "./user.png";

import { BASE_URL } from "../../utils/env";

export default function Socialmedia() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/protected`, {
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
    return <div data-testid="Logging out...">Logging out...</div>;
  }
  return (
    <>
      <div className="h-screen w-full flex flex-col gap-5 pt-10 pl-10">
        <h1 className="text-black text-xl font-semibold">
          Social Media Integration
        </h1>
        <div className="flex flex-row gap-3">
          <Link to={"/Dashboard/Email"}>
            <div className="h-[180px] w-[260px] border border-gray-300 shadow-2xl flex flex-col gap-2 items-center justify-center rounded-lg">
              <img src={user} className="h-18 w-20" />
              <MdOutlineMail size={60} data-testid="MdOutlineMail" />

              <h1 className=" text-lg text-black font-semibold">Email</h1>
            </div>
          </Link>

          <Link to={"/Dashboard/Twilio"}>
            <div className="h-[180px] w-[260px] border border-gray-300 shadow-2xl flex flex-col gap-2 items-center justify-center rounded-lg">
              <img src={course} className="h-18 w-20" />
              <SiTwilio size={60} data-testid="SiTwilio" />

              <h1 className=" text-lg text-black font-semibold">Twilio</h1>
            </div>
          </Link>
          <Link to={"/Dashboard/ReportTempMan"}>
            <div className="h-[180px] w-[260px] border border-gray-300 shadow-2xl flex flex-col gap-2 items-center justify-center rounded-lg">
              <img src={course} className="h-18 w-20" />
              <ImWhatsapp size={60} data-testid="ImWhatsapp" />

              <h1 className=" text-lg text-black font-semibold">Whatsapp</h1>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
