import axios from "axios"; // Ensure axios is installed: npm install axios
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ColorCard from "./ColorCard";
import test from "./test.png";

import { BASE_URL } from "../utils/env"; // Ensure this path is correct

const NewPatientToday = () => {
  const [patientCount, setPatientCount] = useState(0);
  const { userId = "" } = useSelector((state) => state.user || ""); // Get userId from Redux state

  // Fetch today's patient count from the API
  useEffect(() => {
    const fetchTodayPatientCount = async () => {
      if (!userId) return; // Ensure userId is available

      try {
        const response = await axios.get(
          `${BASE_URL}/getTodayPatientCount/${userId}` // Pass userId in the route
        );

        setPatientCount(response.data?.count || 0); // Update state with the count
      } catch (error) {
        console.error("Error fetching today's patient count:", error);
      }
    };

    fetchTodayPatientCount();
  }, [userId]); // Add userId to the dependency array

  return (
    <ColorCard
      icon={test}
      text={"New Patients Today"}
      number={patientCount}
      color={"bg-white"}
    />
  );
};

export default NewPatientToday;
