import axios from "axios";
import React, { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const ReportTable = ({ testId }) => {
  const [testReports, setTestReports] = useState([]);

  // Fetch reports by testId when the component mounts
  useEffect(() => {
    const getReportsByTestId = async () => {
      const response = await axios.get(
        `${BASE_URL}/${testId}`
      );
      setTestReports(response?.data || []);
    };

    getReportsByTestId();
  }, [testId]);

  if (status === "loading") return <p>Loading...</p>;

  if (!testReports || testReports.length === 0)
    return <p>No reports available for this test.</p>;

  return (
    <div className="w-full">
      <table className="w-full bg-blue-200 rounded-lg overflow-hidden">
        <thead className="w-full bg-blue-200 h-14">
          <tr className="text-gray-700 text-sm font-normal leading-normal">
            <th className="py-4 px-6 text-left">Field Name</th>
            <th className="py-4 px-6 text-left">Results</th>
            <th className="py-4 px-6 text-left">Units</th>
            <th className="py-4 px-6 text-left">Reference Range</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {testReports.map((report) =>
            report.fields.map((field, index) => (
              <tr
                key={`${report._id}-${index}`}
                className={`text-gray-700 font-normal leading-normal ${
                  index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white border-b border-t border-gray-300"
                }`}
              >
                {console.log("index", index)}
                <td className="py-4 px-6">{field.fieldName}</td>
                <td className="py-4 px-6">{field.results}</td>
                <td className="py-4 px-6">{field.units}</td>
                <td className="py-4 px-6">{field.referenceRange}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
