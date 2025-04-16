import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Twilio = () => {
  const { userId } = useSelector((state) => state.user);

  const [twilioSid, setTwilioSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [twilioActiveNumber, setTwilioActiveNumber] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/userProfile/Data/${userId}`
        );
        if (response.ok) {
          const result = await response.json();
          setTwilioSid(result.twilioSid || "");
          setTwilioAuthToken(result.twilioAuthToken || "");
          setTwilioActiveNumber(result.twilioActiveNumber || "");
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleTwilioSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      userId,
      twilioSid,
      twilioAuthToken,
      twilioActiveNumber,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/userProfile/Twilio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      <div className="w-full bg-white rounded-lg p-6 px-20">
        <h2 className="text-2xl font-bold text-center mb-6">Twilio </h2>
        <form onSubmit={handleTwilioSubmit}>
          <div className="w-full flex flex-row gap-5 ">
            <div className="mb-4 w-full">
              <label
                htmlFor="twilioSid"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Twilio SID
              </label>
              <input
                type="text"
                id="twilioSid"
                name="twilioSid"
                value={twilioSid}
                onChange={(e) => setTwilioSid(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
                placeholder="Enter your Twilio SID"
                required
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="twilioAuthToken"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Twilio Auth Token
              </label>
              <input
                type="password"
                id="twilioAuthToken"
                name="twilioAuthToken"
                value={twilioAuthToken}
                onChange={(e) => setTwilioAuthToken(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
                placeholder="Enter your Twilio Auth Token"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="twilioActiveNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Twilio Active Number
            </label>
            <input
              type="text"
              id="twilioActiveNumber"
              name="twilioActiveNumber"
              value={twilioActiveNumber}
              onChange={(e) => setTwilioActiveNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm"
              placeholder="Enter your Twilio Active Number"
              required
            />
          </div>
          <div className="flex flex-row gap-10">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-900 text-white font-semibold rounded-lg shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Twilio;
