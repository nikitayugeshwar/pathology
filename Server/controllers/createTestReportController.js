const CreateTestReport = require("../models/createTestReport");
const ConfigTemplate = require("../models/ConfigTemplate");
const Patient = require("../models/patient");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
const PatientNotificationCount = require("../models/notificationCount");
const OutOfRangeTestResult = require("../models/OutOfRangeTestResult");
const UsersProfile = require("../models/userProfile");
const twilio = require("twilio");
const multer = require("multer");
const fs = require("fs");
const QRCode = require("qrcode");

const Report = require("../models/reportModel");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ".pdf"); // Always save as a PDF
  },
});
const upload = multer({ storage });

exports.sendEmailWithReport = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request body is missing.");
    }

    const { patientEmail, patient, configTemplate, testResults, userData } =
      req.body;

    // Validate required fields
    if (!patientEmail || !patient) {
      throw new Error("Missing required fields: patientEmail or patient.");
    }

    const isOutOfRange = (result, referenceRange) => {
      if (!referenceRange) return false; // Ensure referenceRange exists
      const [min, max] = referenceRange.split("-").map(Number);
      const numericResult = parseFloat(result);

      if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
        return numericResult < min || numericResult > max;
      }
      return false;
    };

    // Generate the PDF link
    const pdfLink = `${req.protocol}://${req.get("host")}/api/reports/${
      patient._id
    }`;

    const qrCodeDataUrl = await QRCode.toDataURL(pdfLink);

    let htmlContent = `
<html>
  <head>
    <style>
      @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
      @page {
        size: A4;
        margin: 5mm;
      }
      body {
        font-family: Arial, sans-serif;
      }

       .triangle {
        width: 0;
        height: 0;
        border-top: 56px solid #fff;
        border-left: 0 solid transparent;
        border-right: 50px solid transparent;
      }
       
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .triangle {
          transform: rotate(0deg) !important;
        }
        .bg-red-500 {
          background-color: #ef4444 !important;
        }
        .bg-teal-700 {
          background-color: #00796B !important;
        }
        .w-full .border-t-teal-700 {
          border-top: 4px solid #00796B !important;
        }
        .text-gray-500 {
          color: #6b7280 !important;
        }
      }
    </style>
  </head>
  <body class="w-full mx-auto bg-white">
    <div>
      ${testResults
        .map(
          (report, reportIndex) => `
        <div>
          <!-- Header Section -->
          <div class="w-full flex flex-col justify-between items-center p-1">
                           <div class="w-full">
                <div class="h-auto flex items-center gap-3 w-full">
                  <img
                    src="${configTemplate?.logo}"
                    alt="Logo"
                    class="h-20 w-20 rounded-full flex-shrink-0"
                  />
                  <div class=" h-8 flex items-center bg-teal-700 w-full">
                    <span class="h-10 lg:text-3xl text-xl bg-white font-bold  leading-[80px] pr-5">
                     ${configTemplate?.headerName}
                    </span>
                    <div
                      class="triangle lg:border-b-[56px] border-b-[40px] border-t-red border-white border-l-[50px] border-l-transparent rotate-180 flex-shrink-0"
                    ></div>
                    <h1 class="text-white font-bold lg:text-lg text-sm text-center lg:pl-10 pl-3">
                      Mob:- ${configTemplate?.mobile}
                    </h1>
                  </div>
                </div>
              </div>
              
          
            <div class="border-b-2 w-full lg:h-3 h-3 bg-teal-700 mt-1"></div>
            <div class="flex flex-col">
              <p class="text-pink-500 text-md font-semibold uppercase">${
                configTemplate?.subHeaderName
              }</p>
              <div class="border-b w-full h-1 bg-yellow-400"></div>
            </div>
          </div>

          <!-- Patient Info Section -->
          <div class="flex flex-row gap-10 w-full border border-black p-2 text-sm">
            <div class=" flex flex-col gap-1 lg:tracking-wider">
              <p><span class="font-semibold">Patient Name:</span> ${
                patient?.firstName
              } ${patient?.lastName}</p>
              <p><span class="font-semibold">Age & Sex:</span> ${
                patient?.age
              } | ${patient?.gender}</p>
              <p><span class="font-semibold">Contact No:</span> ${
                patient?.contactNumber
              }</p>
              <p><span class="font-semibold">Address:</span> ${
                patient?.address
              }</p>
            </div>
            <div class="flex flex-row gap-10">
              <div class="text-left  flex flex-col gap-1 lg:tracking-wider">
                <p><span class="font-semibold">Ref. No.:</span> ${
                  patient?.patientNumber
                }</p>
                <p><span class="font-semibold">Collection Date:</span> ${
                  patient?.collectAt
                }</p>
                <p><span class="font-semibold">Reporting Date:</span> ${new Date(
                  patient?.dateTime
                ).toLocaleString()}</p>
                <p><span class="font-semibold">Referred By:</span> ${
                  patient?.doctorName
                }</p>
              </div>
            </div>
             <div class="text-right ml-10 flex items-center justify-center">
              <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 100px; height: 100px;" />
            </div>
            
          </div>

          <!-- Test Results Section -->
          <div class="h-auto w-full flex flex-col gap-10">
            <div class="border border-black">
              <table class="w-full rounded-lg">
                <thead class="w-full border-b border-black h-14">
                  <tr class="text-gray-700 text-sm font-normal leading-normal">
                    <th class="py-2 px-6 text-left">Field Name</th>
                    <th class="py-2 px-6 text-left">Results</th>
                    <th class="py-2 px-6 text-left">Units</th>
                    <th class="py-2 px-6 text-left">Reference Range</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm font-light">
                  <tr class="border-b border-b-black">
                    <td colspan="4" class="py-2 text-center text-black text-lgl font-bold">${
                      report.testName || "Loading..."
                    }</td>
                  </tr>
                  ${report.subtests
                    .map(
                      (subtest) => `
                    <tr>
                      <td colspan="4" class="h-2 px-2 text-gray-800 text-sm leading-[14px] font-semibold">${
                        subtest.subtestName
                      }</td>
                    </tr>
                    ${subtest.fields
                      .map(
                        (field) => `
                      <tr class="text-gray-700 font-normal h-[2px]">
                        <td class="px-2">${field.fieldName}</td>
                        <td class="px-6 ${
                          isOutOfRange(field.results, field.referenceRange)
                            ? "text-red-600 font-bold"
                            : ""
                        }">${field.results}</td>
                        <td class="px-6">${field.units}</td>
                        <td class="px-6">${field.referenceRange}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>

         
          <div class="p-4">
            <div class="flex justify-between items-center p-4">
              <div class="text-center">
                <img src="${
                  configTemplate?.signature1
                }" alt="Signature" class="h-16" />
                <p class="font-bold">Lab Incharge</p>
                <p class="font-bold">${configTemplate?.doctorName}</p>
              </div>
              <div class="text-center">
                <img src="${
                  configTemplate?.signature2
                }" alt="Signature" class="h-16" />
                <p class="font-bold">Consultant Pathologist</p>
              </div>
            </div>
            <div class="lg:px-10 px-5 w-full">Notes:${report.reportNotes}</div>
          </div>

          <!-- Page Break -->
          ${
            reportIndex < testResults.length - 1
              ? '<div class="page-break" style="page-break-before: always;"></div>'
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>
  </body>
 </html>`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", left: "10mm", right: "10mm", bottom: "10mm" },
    });
    await browser.close();

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: userData.email,
        pass: userData.password,
      },
    });

    const pdfFileName = `${patient.patientNumber}_report_${Date.now()}.pdf`;
    const mailOptions = {
      from: userData.email,
      to: patientEmail,
      subject: "Patient Report",
      text: "Attached patient report card.",
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };
    if (userData.emailActive) {
      await transporter.sendMail(mailOptions);
      console.log(`Email successfully sent to ${patientEmail}`);
    }

    // Save the PDF to the file system after email is sent
    const pdfFilePath = `uploads/${pdfFileName}`;
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    // Save or update the PDF file path in the database
    const existingReport = await Report.findOne({
      patientId: patient._id,
    });

    if (existingReport) {
      // Remove old file
      fs.unlink(existingReport.filePath, (err) => {
        if (err) {
          console.error("Error deleting old PDF file:", err);
        } else {
          console.log("Old PDF file deleted successfully");
        }
      });

      // Update the file path in the database
      existingReport.filePath = pdfFilePath;
      await existingReport.save();
    } else {
      // Create a new report entry
      const newReport = new Report({
        patientId: patient._id,
        filePath: pdfFilePath,
      });
      await newReport.save();
    }

    // Send the PDF link via Twilio
    const { twilioSid, twilioAuthToken, twilioActiveNumber } = userData;
    const twilioClient = twilio(twilioSid, twilioAuthToken);
    const formattedNumber = patient?.contactNumber.toString().startsWith("+91")
      ? mobileNumber.toString()
      : `+91${patient?.contactNumber.toString()}`;

    if (userData.twilioActive) {
      const message = await twilioClient.messages.create({
        body: `Here is your PDF link: ${pdfLink}`,
        from: twilioActiveNumber,
        to: formattedNumber,
      });
      console.log("PDF link sent via SMS:", message.sid);
    }

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email with report:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createTestReport = async (req, res) => {
  const { patientId, tests, userId } = req.body;

  try {
    // Validate required fields
    if (!patientId || !userId || !tests || tests.length === 0) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Find patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientName = `${patient.firstName} ${patient.lastName}`;

    for (const test of tests) {
      const { testId, testName, subtests, reportNotes } = test;

      if (!Array.isArray(subtests) || subtests.length === 0) {
        console.error("Invalid subtests format for test:", test);
        continue;
      }

      // Check if a test report exists
      let testReport = await CreateTestReport.findOne({ patientId, testId });

      const outOfRangeFields = [];
      for (const subtest of subtests) {
        const { fields } = subtest;

        if (!Array.isArray(fields) || fields.length === 0) {
          console.error("Invalid fields format in subtest:", subtest);
          continue;
        }

        outOfRangeFields.push(
          ...fields.filter((field) => {
            const [min, max] = field.referenceRange.split("-").map(Number);
            const result = parseFloat(field.results);
            return result < min || result > max;
          })
        );
      }

      // Save or update out-of-range results
      if (outOfRangeFields.length > 0) {
        let outOfRangeReport = await OutOfRangeTestResult.findOne({
          patientId,
          testId,
        });

        if (outOfRangeReport) {
          outOfRangeReport.testResult = outOfRangeFields;
          await outOfRangeReport.save();
        } else {
          const newOutOfRangeReport = new OutOfRangeTestResult({
            patientId,
            patientName,
            testId,
            testName,
            userId,
            testResult: outOfRangeFields,
          });
          await newOutOfRangeReport.save();
        }
      }

      // Update existing test report or create a new one
      if (testReport) {
        subtests.forEach((newSubtest) => {
          const existingSubtest = testReport.subtests.find(
            (s) => s.subtestName === newSubtest.subtestName
          );

          if (existingSubtest) {
            newSubtest.fields.forEach((newField) => {
              const existingField = existingSubtest.fields.find(
                (f) => f.fieldName === newField.fieldName
              );
              if (existingField) {
                existingField.results = newField.result;
              } else {
                existingSubtest.fields.push(newField);
              }
            });
          } else {
            testReport.subtests.push(newSubtest);
          }
        });

        testReport.userId = userId;
        testReport.reportNotes = reportNotes || ""; // Update report notes
        await testReport.save();
      } else {
        const newTestReport = new CreateTestReport({
          patientId,
          testId,
          testName,
          userId,
          reportNotes: reportNotes || "", // Save report notes
          subtests,
        });

        await newTestReport.save();
      }
    }

    // Increment notification count for the user
    const notification = await PatientNotificationCount.findOne({ userId });
    if (notification) {
      notification.notificationCount += 1;
      await notification.save();
    } else {
      const newNotification = new PatientNotificationCount({
        userId,
        notificationCount: 1,
      });
      await newNotification.save();
    }

    const configTemplate = await ConfigTemplate.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!configTemplate) {
      return res.status(404).json({ message: "Config template not found" });
    }

    const userData = await UsersProfile.findOne({ userId }).lean();

    res.status(200).json({
      message:
        "Test report created/updated successfully and email sent to patient",
      success: true,
      patient,
      configTemplate,
      userData,
    });
  } catch (error) {
    console.error("Error creating/updating test report:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update an existing test report by ID
exports.updateTestReport = async (req, res) => {
  const { patientId, tests, userId } = req.body; // Extract the tests array

  try {
    if (!patientId || !userId || !tests || tests.length === 0) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Loop through each test and process it
    for (const test of tests) {
      const { testId, fields } = test;
      console.log("1", testId);
      console.log("2", patientId);

      // Find an existing test report for the given patient and testId
      let testReport = await CreateTestReport.findOne({ patientId, testId });
      console.log("testReprt", testReport);

      if (testReport) {
        // If test report exists, update or add fields
        fields.forEach((newField) => {
          console.log("newField", newField);
          console.log("testrepoprt", testReport.fields);
          const existingField = testReport.fields.find(
            (field) => field.fieldName === newField.fieldName
          );
          console.log("existingfields", existingField);

          if (existingField) {
            // Update the result if it already exists
            console.log(`Updating result for field:`);
            existingField.results = newField.results || newField.result; // Handle potential property mismatch
          } else {
            // Add new field if it doesn't exist
            console.log(`Adding new field: `);
            existingSubtest.fields.push({
              ...newField,
              results: newField.results || newField.result, // Ensure results field is populated
            });
          }
        });

        // Update the userId (who updated the report)
        testReport.userId = userId;

        // Save the updated test report
        await testReport.save();
      } else {
        // If no report exists for the testId, create a new one
        const newTestReport = new CreateTestReport({
          patientId,
          testId,
          fields,
          userId,
        });

        // Save the new test report
        await newTestReport.save();
      }
    }

    return res.status(200).json({
      message: "Test report created/updated successfully",
    });
  } catch (error) {
    console.error("Error creating/updating test report:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Delete a test report by ID
exports.deleteTestReport = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReport = await CreateTestReport.findByIdAndDelete(id);
    if (!deletedReport) {
      return res.status(404).json({ message: "Test report not found" });
    }

    return res.status(200).json({
      message: "Test report deleted successfully",
      testReport: deletedReport,
    });
  } catch (error) {
    console.error("Error deleting test report:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get all test reports
exports.getAllTestReports = async (req, res) => {
  try {
    const reports = await CreateTestReport.find();
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error retrieving test reports:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get a test report by ID
exports.getTestReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await CreateTestReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Test report not found" });
    }
    return res.status(200).json(report);
  } catch (error) {
    console.error("Error retrieving test report:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get test reports by patient ID

// Controller to get all fields for each test ID associated with a patient
exports.getTestReportsByPatientId = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Step 1: Retrieve the patient and their associated tests
    const patient = await Patient.findById(patientId).select("tests");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!patient.tests || patient.tests.length === 0) {
      return res
        .status(404)
        .json({ message: "No tests found for this patient" });
    }

    // Create a map of testId to testName for reference
    const testIdToNameMap = Object.fromEntries(
      patient.tests.map((test) => [test.id.toString(), test.name])
    );

    // Step 2: Fetch all reports associated with the patient's test IDs
    const testIds = patient.tests.map((test) => test.id);
    const reports = await CreateTestReport.find({
      testId: { $in: testIds },
      patientId, // Ensure the reports belong to this patient
    });

    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ message: "No test reports found for this patient" });
    }

    // Step 3: Enhance reports with test names
    const reportsWithNames = reports.map((report) => ({
      ...report.toObject(),
      testName: testIdToNameMap[report.testId.toString()] || "Unknown Test", // Add test name
    }));

    // Return the enriched reports
    return res.status(200).json(reportsWithNames);
  } catch (error) {
    console.error("Error retrieving test reports by patient ID:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get test reports by test ID
exports.getTestReportsByTestId = async (req, res) => {
  const { testId } = req.params;

  try {
    // Find all reports with the given testId
    const reports = await CreateTestReport.find({ testId });

    // Check if any reports were found
    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ message: "No test reports found for this Test ID" });
    }

    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error retrieving test reports by Test ID:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// API to get the number of fields with empty 'results'
exports.getEmptyResultsCount = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the URL parameters
    console.log("userId", userId);

    // Step 1: Find all patients for the userId
    const patients = await Patient.find({ userId }).select("_id");
    console.log("patients", patients);

    if (!patients.length) {
      return res
        .status(404)
        .json({ message: "No patients found for the given userId." });
    }

    const patientIds = patients.map((patient) => patient._id);

    // Step 2: Aggregate the overall empty results count (one count per patient)
    const emptyResultsCount = await CreateTestReport.aggregate([
      {
        $match: {
          patientId: { $in: patientIds }, // Match patients' IDs
          userId, // Ensure the userId matches
        },
      },
      {
        $unwind: "$fields", // Deconstruct the 'fields' array into individual documents
      },
      {
        $match: {
          $or: [
            { "fields.results": { $eq: "" } }, // Empty string results
            { "fields.results": { $exists: false } }, // Missing results
          ],
        },
      },
      {
        $group: {
          _id: "$patientId", // Group by patientId
        },
      },
      {
        $count: "overallCount", // Count the number of unique patients with empty results
      },
    ]);

    const overallCount =
      emptyResultsCount.length > 0 ? emptyResultsCount[0].overallCount : 0;

    res.status(200).json({ count: overallCount });
  } catch (error) {
    console.error("Error fetching overall empty results count:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
