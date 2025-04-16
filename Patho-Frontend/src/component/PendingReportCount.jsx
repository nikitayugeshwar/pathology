import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ColorCard from "./ColorCard";
import testIcon from "./report.png";

import { BASE_URL } from "../utils/env"; // Ensure this path is correct

const PendingReportCount = () => {
  const [emptyCount, setEmptyCount] = useState(0);
  const { userId = "" } = useSelector((state) => state.user || ""); // Get userId from Redux state

  // Fetch the count of empty result fields from the API
  useEffect(() => {
    const fetchEmptyResultsCount = async () => {
      try {
        if (userId) {
          // Ensure userId is available before making the request
          const response = await axios.get(
            `${BASE_URL}/getEmptyResultsCount/${userId}` // Include userId in the URL
          );
          setEmptyCount(response.data.count); // Update state with the count
        }
      } catch (error) {
        console.error("Error fetching empty results count:", error);
      }
    };

    fetchEmptyResultsCount();
  }, [userId]); // Dependency array now includes userId

  return (
    <ColorCard
      icon={testIcon}
      text={"Empty Results Fields"}
      number={emptyCount}
      color={"bg-white"}
    />
  );
};

export default PendingReportCount;
