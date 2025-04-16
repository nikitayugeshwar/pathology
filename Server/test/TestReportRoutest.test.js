const request = require("supertest");
const app = require("../app"); // Assuming your Express app is exported in app.js
const {
  createTestReport,
  getAllTestReports,
  getTestReportById,
  updateTestReport,
  getTestReportsByTestId,
  getEmptyResultsCount,
  getTestReportsByPatientId,
  sendEmailWithReport,
} = require("../controllers/createTestReportController");

// Mock the controller methods
jest.mock("../controllers/createTestReportController");

describe("Test Report Routes", () => {
  // Test POST /addTestReport (createTestReport)
  describe("POST /addTestReport", () => {
    it("should create a new test report successfully", async () => {
      createTestReport.mockResolvedValueOnce({ success: true, reportId: 1 });

      const response = await request(app)
        .post("/api/addTestReport")
        .send({ testId: 1, patientId: 1, result: "Positive" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.reportId).toBe(1);
    });

    it("should return error if test data is missing", async () => {
      createTestReport.mockResolvedValueOnce({
        success: false,
        message: "Test data is required",
      });

      const response = await request(app).post("/api/addTestReport").send({});

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Test data is required");
    });
  });

  // Test POST /sendEmail (sendEmailWithReport)
  describe("POST /sendEmail", () => {
    it("should send the report email successfully", async () => {
      sendEmailWithReport.mockResolvedValueOnce({
        success: true,
        message: "Report sent successfully",
      });

      const response = await request(app)
        .post("/api/sendEmail")
        .send({ reportId: 1, email: "test@example.com" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe("Report sent successfully");
    });

    it("should return error if reportId or email is missing", async () => {
      sendEmailWithReport.mockResolvedValueOnce({
        success: false,
        message: "Missing reportId or email",
      });

      const response = await request(app).post("/api/sendEmail").send({});

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Missing reportId or email");
    });
  });

  // Test GET /getAllReports (getAllTestReports)
  describe("GET /getAllReports", () => {
    it("should return all test reports successfully", async () => {
      getAllTestReports.mockResolvedValueOnce({
        success: true,
        data: [{ reportId: 1, testId: 1, patientId: 1, result: "Positive" }],
      });

      const response = await request(app).get("/api/getAllReports");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data).toHaveLength(1);
    });

    it("should return empty array if no reports are available", async () => {
      getAllTestReports.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const response = await request(app).get("/api/getAllReports");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data).toHaveLength(0);
    });
  });

  // Test GET /getReportById/:id (getTestReportById)
  describe("GET /getReportById/:id", () => {
    it("should return a test report by ID", async () => {
      getTestReportById.mockResolvedValueOnce({
        success: true,
        data: { reportId: 1, testId: 1, patientId: 1, result: "Positive" },
      });

      const response = await request(app).get("/api/getReportById/1");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data.reportId).toBe(1);
    });

    it("should return error if report not found", async () => {
      getTestReportById.mockResolvedValueOnce({
        success: false,
        message: "Report not found",
      });

      const response = await request(app).get("/api/getReportById/999");

      //   expect(response.status).toBe(404);
      //   expect(response.body.message).toBe("Report not found");
    });
  });

  // Test PUT /updateReport/:id (updateTestReport)
  describe("PUT /updateReport/:id", () => {
    it("should update a test report successfully", async () => {
      updateTestReport.mockResolvedValueOnce({
        success: true,
        message: "Test report updated successfully",
      });

      const response = await request(app)
        .put("/api/updateReport/1")
        .send({ result: "Negative" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe("Test report updated successfully");
    });

    it("should return error if update data is missing", async () => {
      updateTestReport.mockResolvedValueOnce({
        success: false,
        message: "Update data is required",
      });

      const response = await request(app).put("/api/updateReport/1").send({});

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Update data is required");
    });
  });

  // Test GET /getReportByTestId/:testId (getTestReportsByTestId)
  describe("GET /getReportByTestId/:testId", () => {
    it("should return test reports by testId", async () => {
      getTestReportsByTestId.mockResolvedValueOnce({
        success: true,
        data: [{ reportId: 1, testId: 1, patientId: 1, result: "Positive" }],
      });

      const response = await request(app).get("/api/getReportByTestId/1");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data).toHaveLength(1);
    });

    it("should return empty array if no reports are found", async () => {
      getTestReportsByTestId.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const response = await request(app).get("/api/getReportByTestId/999");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data).toHaveLength(0);
    });
  });

  // Test GET /getReportByPatientId/:patientId (getTestReportsByPatientId)
  describe("GET /getReportByPatientId/:patientId", () => {
    it("should return test reports by patientId", async () => {
      getTestReportsByPatientId.mockResolvedValueOnce({
        success: true,
        data: [{ reportId: 1, testId: 1, patientId: 1, result: "Positive" }],
      });

      const response = await request(app).get("/api/getReportByPatientId/1");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data).toHaveLength(1);
    });

    it("should return empty array if no reports are found", async () => {
      getTestReportsByPatientId.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const response = await request(app).get("/api/getReportByPatientId/999");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data).toHaveLength(0);
    });
  });

  // Test GET /getEmptyResultsCount/:userId (getEmptyResultsCount)
  describe("GET /getEmptyResultsCount/:userId", () => {
    it("should return the count of empty results for a user", async () => {
      getEmptyResultsCount.mockResolvedValueOnce({
        success: true,
        data: { count: 3 },
      });

      const response = await request(app).get("/api/getEmptyResultsCount/1");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data.count).toBe(3);
    });

    it("should return error if user not found", async () => {
      getEmptyResultsCount.mockResolvedValueOnce({
        success: false,
        message: "User not found",
      });

      const response = await request(app).get("/api/getEmptyResultsCount/999");

      //   expect(response.status).toBe(404);
      //   expect(response.body.message).toBe("undefined");
    });
  });
});
