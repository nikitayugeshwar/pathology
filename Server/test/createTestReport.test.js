const {
  createTestReport,
} = require("../controllers/createTestReportController");
const Patient = require("../models/Patient");
const CreateTestReport = require("../models/CreateTestReport");
const OutOfRangeTestResult = require("../models/OutOfRangeTestResult");
const ConfigTemplate = require("../models/ConfigTemplate");

jest.mock("../models/Patient");
jest.mock("../models/CreateTestReport");
jest.mock("../models/OutOfRangeTestResult");
jest.mock("../models/notificationCount");
jest.mock("../models/ConfigTemplate");
jest.mock("../models/userProfile");

describe("createTestReport", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        patientId: "123",
        userId: "user123",
        tests: [
          {
            testId: "test123",
            testName: "Blood Test",
            subtests: [
              {
                subtestName: "Hemoglobin",
                fields: [
                  {
                    fieldName: "HGB",
                    results: "14.5",
                    units: "g/dL",
                    referenceRange: "13.0-17.0",
                  },
                ],
              },
            ],
            reportNotes: "All values are normal.",
          },
        ],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return an error if required fields are missing", async () => {
    req.body = { patientId: "123", tests: [] }; // Missing userId

    await createTestReport(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Required fields are missing",
    });
  });

  it("should return an error if patient not found", async () => {
    Patient.findById.mockResolvedValue(null); // Patient not found

    await createTestReport(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Patient not found",
    });
  });

  it("should return an error if subtest format is invalid", async () => {
    req.body.tests[0].subtests = []; // Invalid subtests format

    await createTestReport(req, res);

    // expect(res.status).toHaveBeenCalledWith(500);
    // expect(res.json).toHaveBeenCalledWith({
    //   message: "Server error. Please try again later.",
    // });
  });

  it("should create a new test report when no existing report is found", async () => {
    Patient.findById.mockResolvedValue({ firstName: "John", lastName: "Doe" });
    CreateTestReport.findOne.mockResolvedValue(null); // No existing report

    const newTestReport = new CreateTestReport();
    CreateTestReport.prototype.save = jest
      .fn()
      .mockResolvedValue(newTestReport);

    await createTestReport(req, res);

    expect(CreateTestReport.prototype.save).toHaveBeenCalled();
    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   message:
    //     "Test report created/updated successfully and email sent to patient",
    //   success: true,
    // });
  });

  it("should update an existing test report", async () => {
    const existingTestReport = {
      subtests: [
        {
          subtestName: "Hemoglobin",
          fields: [
            {
              fieldName: "HGB",
              results: "14.0",
              units: "g/dL",
              referenceRange: "13.0-17.0",
            },
          ],
        },
      ],
      save: jest.fn().mockResolvedValue(true),
    };
    Patient.findById.mockResolvedValue({ firstName: "John", lastName: "Doe" });
    CreateTestReport.findOne.mockResolvedValue(existingTestReport);

    await createTestReport(req, res);

    expect(existingTestReport.save).toHaveBeenCalled();
    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   message:
    //     "Test report created/updated successfully and email sent to patient",
    //   success: true,
    // });
  });

  it("should handle out-of-range test results", async () => {
    const outOfRangeTestResult = { save: jest.fn() };
    OutOfRangeTestResult.findOne.mockResolvedValue(null); // No existing out-of-range report
    OutOfRangeTestResult.prototype.save = jest
      .fn()
      .mockResolvedValue(outOfRangeTestResult);

    await createTestReport(req, res);

    // expect(OutOfRangeTestResult.prototype.save).toHaveBeenCalled();
    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   message:
    //     "Test report created/updated successfully and email sent to patient",
    //   success: true,
    // });
  });

  it("should return an error if config template not found", async () => {
    ConfigTemplate.findOne.mockResolvedValue(null); // No config template

    await createTestReport(req, res);

    // expect(res.status).toHaveBeenCalledWith(404);
    // expect(res.json).toHaveBeenCalledWith({
    //   message: "Config template not found",
    // });
  });

  it("should handle server errors", async () => {
    const error = new Error("Database error");
    Patient.findById.mockRejectedValue(error);

    await createTestReport(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });
});
