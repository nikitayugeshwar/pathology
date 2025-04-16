import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllTests } from "../../Redux/configTestSlice";

export default function TestsTable({
  filter,
  searchTerm,
  currentPage,
  entriesPerPage,
  setTestCount,
  setTotalEntries,
  refreshKey,
}) {
  const dispatch = useDispatch();
  const { tests = [], loading, error } = useSelector((state) => state.test);
  const { userId = "" } = useSelector((state) => state.user || ""); // Get userId from Redux state

  useEffect(() => {
    dispatch(getAllTests(userId)); // Fetch test names on component mount
  }, [dispatch, userId, refreshKey]);

  const filteredResults = tests.filter(
    (test) =>
      (filter === "" || test.someFilterValue === filter) &&
      (searchTerm === "" ||
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredResults.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  useEffect(() => {
    setTestCount(tests.length);
    setTotalEntries(filteredResults.length);
  }, [filteredResults, setTestCount, setTotalEntries]);

  return (
    <div className="w-full">
      <table className="w-full bg-blue-200 rounded-lg overflow-hidden">
        <thead className="w-full bg-blue-200 h-14 py-10">
          <tr className="w-full text-gray-700 text-sm font-normal leading-normal">
            <th className="py-4 px-6 text-left">Sr. No</th>
            <th className="py-4 px-6 text-left">Test Name</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light pr-44">
          {false ? (
            <tr>
              <td colSpan="2" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : currentEntries.length > 0 ? (
            currentEntries.map(
              (test, index) => (
                console.log("test", test),
                (
                  <tr
                    key={index}
                    className={`text-gray-700 text-sm font-normal leading-normal ${
                      index % 2 === 0
                        ? "bg-gray-100"
                        : "bg-white border-b border-t border-gray-300"
                    }`}
                  >
                    {console.log("test", test)}
                    <td className="py-4 px-6 text-left">{index + 1}</td>
                    <td className="py-4 px-6 text-left text-blue-600 underline">
                      <Link to={`/Dashboard/TestsDetails/${test.id}`}>
                        {test.testName}
                      </Link>
                    </td>
                  </tr>
                )
              )
            )
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-4">
                No tests available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
