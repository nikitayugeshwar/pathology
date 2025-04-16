import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Successcard from "../../Components/Successcard";

import { BASE_URL } from "../../utils/env";

const isOutOfRange = (result, referenceRange) => {
  const [min, max] = referenceRange.split("-").map(Number);
  const numericResult = parseFloat(result);

  if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
    return numericResult < min || numericResult > max;
  }
  return false;
};

const AddForm = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id: patientId } = useParams();

  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/getReportByPatientId/${patientId}`
        );
        setReports(response.data || []);

        const initialFormData = response.data.reduce(
          (acc, report, reportIndex) => {
            report.subtests.forEach((subtest, subtestIndex) => {
              subtest.fields.forEach((field, fieldIndex) => {
                if (field.result) {
                  acc[`result-${reportIndex}-${subtestIndex}-${fieldIndex}`] =
                    field.result;
                }
              });
            });
            return acc;
          },
          {}
        );

        setFormData(initialFormData);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchReports();
    }
  }, [patientId]);

  const openSuccess = () => setIsSelectOpen(true);

  const closeSuccess = () => {
    setIsSelectOpen(false);
    navigate("/Dashboard/Test");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const testData = reports.map((report, reportIndex) => ({
      testId: report.testId,
      testName: report.testName,
      subtests: report.subtests.map((subtest, subtestIndex) => ({
        subtestName: subtest.subtestName,
        fields: subtest.fields.map((field, fieldIndex) => ({
          fieldName: field.fieldName,
          units: field.units,
          referenceRange: field.referenceRange,
          result:
            formData[`result-${reportIndex}-${subtestIndex}-${fieldIndex}`] ||
            "",
        })),
      })),
      reportNotes: formData[`reportNotes-${reportIndex}`] || "", // Add report notes for each test
    }));

    const reportData = {
      patientId: patientId,
      userId: userId,
      tests: testData,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/addTestReport`,
        reportData
      );

      if (response.data.success) {
        openSuccess();

        const { patient, configTemplate, userData } = response.data;

        const res = await axios.get(
          `${BASE_URL}/getReportByPatientId/${patientId}`
        );

        const testResults = res.data;

        try {
          await axios.post(`${BASE_URL}/sendEmail`, {
            patientEmail: patient.email,
            patient,
            configTemplate,
            testResults,
            userData,
          });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }

        for (let report of testData) {
          for (let subtest of report.subtests) {
            for (let field of subtest.fields) {
              if (isOutOfRange(field.result, field.referenceRange)) {
                try {
                  await axios.post(`${BASE_URL}/api/notify`, {
                    title: `${report.testName} - ${subtest.subtestName} - ${field.fieldName} - Result: ${field.result}`,
                    description: `The result for ${field.fieldName} is out of the reference range.`,
                    date: new Date().toISOString(),
                  });
                } catch (notifyError) {
                  console.error("Error sending notification:", notifyError);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Error submitting report:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (reports.length === 0)
    return <p>No test reports available for this patient.</p>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          {reports.map((report, reportIndex) => (
            <div key={report._id}>
              <h3 className="text-lg font-bold ">{report.testName}</h3>
              {report.subtests.map((subtest, subtestIndex) => (
                <div
                  key={`${report._id}-${subtest.subtestName}`}
                  className="mt-5"
                >
                  <h4 className="font-semibold">{subtest.subtestName}</h4>
                  {subtest.fields.map((field, fieldIndex) => (
                    <div
                      key={`${report._id}-${subtest.subtestName}-${field.fieldName}`}
                      className="w-full grid grid-cols-4 items-center gap-5 mt-2"
                    >
                      <div className="flex flex-col gap-3 w-full">
                        <label className="text-lg font-normal text-black">
                          Field Name*
                        </label>
                        <input
                          type="text"
                          name={`field-${reportIndex}-${subtestIndex}-${fieldIndex}`}
                          placeholder={field.fieldName}
                          className="placeholder:text-black font-semibold bg-gray-200 rounded-md w-full py-3 px-5 outline-none"
                          value={field.fieldName}
                          readOnly
                        />
                      </div>

                      <div className="flex flex-col gap-3 w-full">
                        <label className="text-lg font-normal text-black">
                          Units*
                        </label>
                        <input
                          type="text"
                          name={`units-${reportIndex}-${subtestIndex}-${fieldIndex}`}
                          placeholder={field.units}
                          className="placeholder:text-black font-semibold bg-gray-200 rounded-md w-full py-3 px-5 outline-none"
                          value={field.units}
                          readOnly
                        />
                      </div>

                      <div className="flex flex-col gap-3 w-full">
                        <label className="text-lg font-normal text-black">
                          Reference Range*
                        </label>
                        <input
                          type="text"
                          name={`referenceRange-${reportIndex}-${subtestIndex}-${fieldIndex}`}
                          placeholder={field.referenceRange}
                          className="placeholder:text-black font-semibold bg-gray-200 rounded-md w-full py-3 px-5 outline-none"
                          value={field.referenceRange}
                          readOnly
                        />
                      </div>

                      <div className="flex flex-col gap-3 w-full">
                        <label className="text-lg font-normal text-black">
                          Result*
                        </label>
                        <input
                          type="text"
                          name={`result-${reportIndex}-${subtestIndex}-${fieldIndex}`}
                          placeholder="Type Here"
                          className="placeholder:text-gray-300 border font-semibold bg-white rounded-md w-full py-3 px-5 outline-none"
                          value={
                            formData[
                              `result-${reportIndex}-${subtestIndex}-${fieldIndex}`
                            ] || ""
                          }
                          onChange={handleChange}
                          disabled={!!field.result}
                          required={!field.result}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}{" "}
              <div className="mt-5 flex flex-col gap-2">
                <label className="block text-lg font-normal text-black">
                  Report Notes
                </label>
                <textarea
                  name={`reportNotes-${reportIndex}`}
                  placeholder="Enter report notes"
                  className="w-full border border-gray-300 rounded-lg p-5 outline-none resize-none"
                  value={formData[`reportNotes-${reportIndex}`] || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-5 pb-10">
          <button
            type="submit"
            className="w-[33%] bg-blue-900 text-white font-medium text-lg p-3 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </form>
      {isSelectOpen && (
        <Successcard
          onClose={closeSuccess}
          para="Test report created successfully."
          title="Success"
        />
      )}
    </div>
  );
};

export default AddForm;
