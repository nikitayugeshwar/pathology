import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import ReactQRCode from "react-qr-code"; // Import the QR code component
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { getLatestConfigTemplate } from "../../Redux/configTemplateSlice";
import { getPatientById } from "../../Redux/patientSlice";

import { BASE_URL } from "../../utils/env"; // Adjust the import path
const WATERMARK_URL =
  "https://res.cloudinary.com/dstz0wiuz/image/upload/f_auto,q_auto/v1/admins/wop34wqzyax0yrz3brmb";

const ViewReport = () => {
  const { id } = useParams();
  const [shareLink, setShareLink] = useState("");
  const [isShareLink, setIsShareLink] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const reportRef = useRef();
  const patientId = id;

  const handleShare = async () => {
    try {
      setIsShareLink(true);
    } catch (error) {
      console.error("Error retrieving share link:", error);
      alert("Could not retrieve or generate shareable link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (dataReady) {
        const data = `${BASE_URL}/api/reports/${patientId}`;
        if (data) setShareLink(data);
      }
    };
    fetchData();
  }, [dataReady]);

  const handlePrint = useReactToPrint({
    onAfterPrint: () => setPrinting(false),
    content: () => reportRef.current,
    documentTitle: "Patient_Report",
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
           .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.2;
          z-index: -1;
          width: 100%;
          height: auto;
          display: block !important;
        }

        table {
          border-collapse: collapse;
          width: 100%;
        }
        thead {
          display: table-row-group; /* Ensure <thead> renders as intended */
        }
  
        tr, td {
          page-break-inside: avoid; /* Prevent breaking rows across pages */
        }
        table thead {
          visibility: visible; /* Ensure thead is visible on first page */
        }
        table thead + tbody tr:first-child thead {
          visibility: hidden; /* Suppress repeated headers */
        }
  
        @page {
          margin: 1in; /* Adjust as needed */
          size: auto; /* Use auto size */
        }
  
        /* Hide browser default header/footer (like URL, title, or date) */
        @page {
          margin: 0;
        }
      }
    `,
  });

  return (
    <div className="h-auto w-full flex flex-col p-5 gap-10">
      <div className="flex w-full justify-between items-center">
        <Link to={"/Dashboard/Report"}>
          <button className="flex items-center justify-center gap-2">
            <FaArrowLeftLong className="h-10 w-10 bg-gray-100 rounded-full p-2" />
            <h1 className="text-lg font-semibold">Back</h1>
          </button>
        </Link>

        <div className="flex gap-5 items-center justify-center">
          <button
            className="border-2 border-blue-900 text-blue-900 font-semibold rounded-md px-5 py-1.5"
            onClick={handleShare}
            disabled={loading}
          >
            Share
          </button>
          <button
            className="bg-blue-900 text-white font-semibold rounded-md px-5 py-2 outline-none"
            onClick={() => {
              setPrinting(true);
              handlePrint();
            }}
          >
            Print
          </button>
        </div>
      </div>

      {isShareLink && (
        <div className="mt-4">
          <p>Shareable Link:</p>
          <a
            href={shareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            {shareLink}
          </a>
        </div>
      )}

      <div ref={reportRef} className="pb-10">
        <Report
          id={id}
          shareLink={shareLink}
          setDataReady={setDataReady}
          printing={printing}
        />
      </div>
    </div>
  );
};

export default ViewReport;

const isOutOfRange = (result, referenceRange) => {
  if (!referenceRange) return false; // Ensure referenceRange exists
  const [min, max] = referenceRange.split("-").map(Number);
  const numericResult = parseFloat(result);

  if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
    return numericResult < min || numericResult > max;
  }
  return false;
};

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format the date
  const formattedDate = new Date(date).toLocaleString("en-GB", options);
  return formattedDate.replace(",", " |"); // Replace the comma with a pipe for better format
};

const calculateFontSize = (numChars) => {
  const maxFontSize = 105; // Font size for 10 characters
  const minFontSize = 70; // Font size for 17 characters
  const maxChars = 10;
  const minChars = 17;

  // Linear interpolation between minFontSize and maxFontSize
  if (numChars <= maxChars) return maxFontSize;
  if (numChars >= minChars) return minFontSize;

  return (
    maxFontSize -
    ((numChars - maxChars) / (minChars - maxChars)) *
      (maxFontSize - minFontSize)
  );
};

const Report = ({ id, shareLink, setDataReady, printing }) => {
  const dispatch = useDispatch();
  const testId = id; // Use the provided testId from props
  const patientId = id; // Use the provided testId from props
  const [reportNotes, setReportNotes] = useState("");

  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [fontSize, setFontSize] = useState("70px"); // Default font size
  const headerTextRef = useRef(null);
  const headerContainerRef = useRef(null);
  const isLargeScreen = window.innerWidth >= 1024;

  // Select patient and report data from Redux store

  const {
    patient,
    loading: patientLoading,
    error: patientError,
  } = useSelector((state) => state.patient);

  // Select config template data from Redux store
  const { latestConfigTemplate } = useSelector((state) => {
    return state.configTemplate;
  });

  console.log("config ", latestConfigTemplate);
  const { userId } = useSelector((state) => state.user);

  // Destructure properties from configTemplate or set default values
  const {
    logo = "",
    clinicName = "",
    signature1 = "",
    signature2 = "",
    mobile = "",
    headerName = "",
    doctorName = "",
    subHeaderName = "",
    footer = "",
    reportData = [],
  } = latestConfigTemplate || {}; // Default to an empty object if configTemplate is null

  console.log("Printing state in Report:", printing);

  // Fetch patient data by testId and report template by patientId
  useEffect(() => {
    dispatch(getPatientById(id));
    dispatch(getLatestConfigTemplate(userId)); // Fetch the latest config template
  }, [dispatch, testId, patientId, userId, id]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/getReportByPatientId/${patientId}`
        );

        setReports(response.data || []);
        setDataReady(true);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      }
    };

    if (patientId) {
      fetchReports();
    }
  }, [patientId]);

  useEffect(() => {
    const updateFontSize = () => {
      if (headerTextRef.current) {
        const textLength = headerTextRef.current.innerText.length;
        const newFontSize = calculateFontSize(textLength);
        setFontSize(`${newFontSize}px`);
      }
    };

    updateFontSize(); // Initial calculation
    window.addEventListener("resize", updateFontSize); // Recalculate on resize

    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  // Display loading or error state
  if (patientLoading) return <p>Loading patient data...</p>;
  if (patientError) return <p>Error: {patientError}</p>;

  return (
    <div className="">
      {/* Patient Information Section */}
      <div
        className={`px-4 flex flex-col  ${
          printing ? "flex flex-col gap-0" : "flex flex-col gap-0"
        }`}
      >
        {/* Report Table */}

        {reports.map((report, reportIndex) => (
          <>
            <div className="h-screen w-full flex flex-col justify-between gap-5  rounded-lg p-4 pb-32 relative ">
              {/* Watermark Image */}
              <img
                src={WATERMARK_URL}
                alt="Watermark"
                className="watermark absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 z-0 w-[25%] h-auto pointer-events-none"
              />
              <div className="w-full h-auto flex flex-col gap-5 rounded-lg p-4 ">
                <div className="w-full flex flex-col  justify-between items-center p-1 ">
                  {/* header section  */}
                  <div className="w-full">
                    <div className="h-auto flex items-center gap-3 w-full">
                      <img
                        src={logo}
                        alt="Logo"
                        className="h-20 w-20 rounded-full flex-shrink-0"
                      />

                      <div className=" lg:h-14 h-10 flex items-center   bg-teal-700 w-full">
                        <span className="lg:text-3xl text-xl bg-white font-bold lg:leading-[60px] leading-[60px] pr-5">
                          {headerName}
                        </span>
                        <div
                          className="w-0 h-0 border-r-transparent
                        lg:border-b-[56px] border-b-[40px] border-t-red border-white border-l-[50px] border-l-transparent rotate-180 flex-shrink-0"
                        ></div>
                        <h1 className="text-white font-bold lg:text-lg text-sm  text-center lg:pl-10 pl-3">
                          Mob:- {mobile}
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="border-b-2 w-full lg:h-3 h-3 bg-teal-700 mt-1"></div>
                  <div className="flex flex-col">
                    <p className="text-pink-500 text-md font-semibold uppercase">
                      {subHeaderName}
                    </p>
                    <div className="border-b w-full h-1 bg-yellow-400"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 w-full border border-black p-2 text-sm ">
                  <div className=" flex flex-col gap-1 lg:tracking-wider">
                    <p>
                      <span className="font-semibold">Patient Name:</span>{" "}
                      {patient?.firstName} {patient?.lastName}
                    </p>
                    <p>
                      <span className="font-semibold">Age & Sex:</span>{" "}
                      {patient?.age} | {patient?.gender}
                    </p>
                    <p>
                      <span className="font-semibold">Contact No:</span>{" "}
                      {patient?.contactNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {patient?.address}
                    </p>
                  </div>

                  <div className="flex flex-row gap-10">
                    <div className="text-left  flex flex-col gap-1 lg:tracking-wider">
                      <p>
                        <span className="font-semibold">Ref. No.:</span>{" "}
                        {patient?.patientNumber}
                      </p>
                      <p>
                        <span className="font-semibold">Collection Date:</span>{" "}
                        {patient?.collectAt}
                      </p>
                      <p>
                        <span className="font-semibold">Reporting Date :</span>{" "}
                        {formatDate(patient?.dateTime)}
                      </p>
                      <p>
                        <span className="font-semibold">Referred By:</span>{" "}
                        {patient?.doctorName}
                      </p>
                    </div>

                    {/* qr code */}
                  </div>
                  <div className="text-right  ml-10 flex items-center justify-center">
                    <ReactQRCode value={shareLink} size={100} />
                  </div>
                </div>

                <div
                  key={report._id}
                  className="h-auto w-full flex flex-col  gap-10"
                >
                  <div className="border border-black ">
                    <table className="w-full rounded-lg ">
                      <thead className="w-full border-b border-black h-14">
                        <tr className="text-gray-700 text-sm font-normal leading-normal">
                          <th className="py-2 px-6 text-left">Field Name</th>
                          <th className="py-2 px-6 text-left">Results</th>
                          <th className="py-2 px-6 text-left">Units</th>
                          <th className="py-2 px-6 text-left">
                            Reference Range
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {/* Test name displayed as a full-width row */}
                        <tr className="border-b border-b-black ">
                          <td
                            colSpan="4"
                            className="py-4 text-center text-black text-2xl font-bold"
                          >
                            {report.testName || "Loading..."}
                          </td>
                        </tr>
                        {/* Iterate through the subtests */}
                        {report.subtests.map((subtest, subtestIndex) => (
                          <React.Fragment key={subtestIndex}>
                            <tr className="h-2">
                              <td
                                colSpan="4"
                                className="h-2 px-2 -space-y-px text-gray-800 text-lg leading-[18px] font-semibold  "
                              >
                                {subtest.subtestName}
                              </td>
                            </tr>
                            {/* Iterate through fields in each subtest */}
                            {subtest.fields.map((field, fieldIndex) => (
                              <tr
                                key={`${report._id}-${subtestIndex}-${fieldIndex}`}
                                className="text-gray-700 font-normal h-[2px]"
                              >
                                <td className="px-2">{field.fieldName}</td>
                                <td
                                  className={`px-6 ${
                                    isOutOfRange(
                                      field.results,
                                      field.referenceRange
                                    )
                                      ? "text-red-600 font-bold"
                                      : ""
                                  }`}
                                >
                                  {field.results}
                                </td>
                                <td className="px-6">{field.units}</td>
                                <td className="px-6">{field.referenceRange}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-center  w-full mt-5">
                  ---------- end of report ----------
                </div>

                {/* Signature Section */}
                <div className=" p-4">
                  <div className="flex justify-between items-center p-4">
                    <div className="text-center">
                      <img src={signature1} alt="Signature" className="h-16" />
                      <p className="font-bold">Lab Incharge</p>
                      <p className="font-bold">{doctorName}</p>
                    </div>
                    <div className="text-center">
                      <img src={signature2} alt="Signature" className="h-16" />
                      <p className="font-bold"> Consultant Pathologist</p>
                    </div>
                  </div>

                  <div className="w-full flex flex-col rounded-t-xl overflow-hidden">
                    <div className=" w-full h-auto flex flex-col gap-5  rounded-b-lg">
                      {/* Render Report Notes */}
                      {report.reportNotes && (
                        <div className="flex gap-2 w-full mt-4">
                          <h1 className="text-gray-900 font-normal text-lg">
                            Report Notes :
                          </h1>
                          <p className="text-black font-medium text-lg">
                            {report.reportNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <MedicoLegalBanner />
            </div>
            {reportIndex < reports.length - 1 && (
              <div
                className="page-break"
                style={{ pageBreakBefore: "always" }}
              ></div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

const MedicoLegalBanner = () => {
  return (
    <div
      className="w-full h-4 "
      dangerouslySetInnerHTML={{
        __html: `
      <svg viewBox="0 0 720 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0,50 Q360,120 720,50 L720,148 L0,148 Z" fill="#e65100"/>
        <path d="M0,45 Q360,110 720,45" fill="none" stroke="#2196f3" stroke-width="6"/>
        <path d="M0,40 Q360,105 720,40" fill="none" stroke="#ffeb3b" stroke-width="6"/>
        <path d="M0,35 Q360,100 720,35" fill="none" stroke="#4caf50" stroke-width="6"/>
       
      </svg>
    `,
      }}
    />
  );
};
