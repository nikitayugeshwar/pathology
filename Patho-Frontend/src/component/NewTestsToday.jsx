import axios from "axios";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ColorCard from "./ColorCard";
import testIcon from "./test.png";

import { BASE_URL } from "../utils/env"; // Ensure this path is correct

const NewTestsToday = () => {
  const [testCount, setTestCount] = useState(0);
  const { userId = "" } = useSelector((state) => state.user || ""); // Get userId from Redux state

  // Fetch today's test count from the API
  useEffect(() => {
    const fetchTodayTestCount = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/getTodayTestCount/${userId}` // Include userId in the URL
        );
        setTestCount(response.data.count); // Update state with the count
      } catch (error) {
        console.error("Error fetching today's test count:", error);
      }
    };

    if (userId) {
      // Ensure userId is available before making the request
      fetchTodayTestCount();
    }
  }, [userId]); // Dependency array now includes userId

  return (
    <ColorCard
      icon={testIcon}
      text={"Tests Today"}
      number={testCount}
      color={"bg-white"}
    />
  );
};

export default NewTestsToday;
