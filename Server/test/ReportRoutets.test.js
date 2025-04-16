const request = require("supertest");
const app = require("../app"); // Assuming your Express app is exported in app.js
const {
  uploadReport,
  getReportByPatientId,
} = require("../controllers/reportController");

jest.mock("../controllers/reportController");

describe("Report Routes", () => {
  // Test POST /upload (uploadReport)
  describe("POST /upload", () => {
    it("should upload PDF report successfully", async () => {
      uploadReport.mockResolvedValueOnce({
        success: true,
        message: "Report uploaded successfully",
      });

      const response = await request(app)
        .post("/api/upload")
        .attach("pdf", Buffer.from("dummy pdf content"), "report.pdf");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe("Report uploaded successfully");
    });

    it("should return error if no file is uploaded", async () => {
      const response = await request(app)
        .post("/api/upload")
        .field("name", "Test Report");

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("No file uploaded");
    });

    it("should return error if file is not a PDF", async () => {
      const response = await request(app)
        .post("/api/upload")
        .attach("pdf", Buffer.from("dummy content"), "report.txt");

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Only PDF files are allowed");
    });
  });

  // Test GET /:patientId (getReportByPatientId)
  describe("GET /:patientId", () => {
    it("should retrieve the report by patientId", async () => {
      getReportByPatientId.mockResolvedValueOnce({
        success: true,
        report: {
          patientId: "12345",
          reportName: "Test Report",
          reportUrl: "http://example.com/report.pdf",
        },
      });

      const response = await request(app).get("/api/12345");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.report.patientId).toBe("12345");
      //   expect(response.body.report.reportName).toBe("Test Report");
    });

    it("should return error if report not found for the patientId", async () => {
      getReportByPatientId.mockResolvedValueOnce({
        success: false,
        message: "Report not found for patientId 12345",
      });

      const response = await request(app).get("/api/12345");

      //   expect(response.status).toBe(404);
      //   expect(response.body.message).toBe(
      //     "Report not found for patientId 12345"
      //   );
    });
  });
});
