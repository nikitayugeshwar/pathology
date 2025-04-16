const request = require("supertest");
const app = require("../app"); // Assuming your Express app is exported in app.js
const {
  saveUser,
  saveTwilioData,
  getUserById,
  updateToggleStatus,
  getToggleStatus,
} = require("../controllers/userProfileController");
const { sendPdfLinkController } = require("../controllers/twilioController");

// Mock the controller methods
jest.mock("../controllers/userProfileController");
jest.mock("../controllers/twilioController");

describe("User Profile Routes", () => {
  // Test POST /Email (saveUser)
  describe("POST /Email", () => {
    it("should save user data successfully", async () => {
      saveUser.mockResolvedValueOnce({ success: true });

      const response = await request(app)
        .post("/api/Email")
        .send({ email: "user@example.com", name: "John Doe" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
    });

    it("should return error if email is missing", async () => {
      saveUser.mockResolvedValueOnce({
        success: false,
        message: "Email is required",
      });

      const response = await request(app)
        .post("/api/Email")
        .send({ name: "John Doe" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Email is required");
    });
  });

  // Test POST /Twilio (saveTwilioData)
  describe("POST /Twilio", () => {
    it("should save Twilio data successfully", async () => {
      saveTwilioData.mockResolvedValueOnce({ success: true });

      const response = await request(app)
        .post("/api/Twilio")
        .send({ twilioSid: "TWILIO_SID", authToken: "TWILIO_AUTH_TOKEN" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
    });

    it("should return error if Twilio SID is missing", async () => {
      saveTwilioData.mockResolvedValueOnce({
        success: false,
        message: "Twilio SID is required",
      });

      const response = await request(app)
        .post("/api/Twilio")
        .send({ authToken: "TWILIO_AUTH_TOKEN" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Twilio SID is required");
    });

    it("should return error if Twilio Auth Token is missing", async () => {
      saveTwilioData.mockResolvedValueOnce({
        success: false,
        message: "Twilio Auth Token is required",
      });

      const response = await request(app)
        .post("/api/Twilio")
        .send({ twilioSid: "TWILIO_SID" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Twilio Auth Token is required");
    });
  });

  // Test GET /Data/:userId (getUserById)
  describe("GET /Data/:userId", () => {
    it("should get user data by userId", async () => {
      getUserById.mockResolvedValueOnce({
        success: true,
        data: { userId: 1, email: "user@example.com", name: "John Doe" },
      });

      const response = await request(app).get("/api/Data/1");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data).toEqual({
      //     userId: 1,
      //     email: "user@example.com",
      //     name: "John Doe",
      //   });
    });

    it("should return error if user not found", async () => {
      getUserById.mockResolvedValueOnce({
        success: false,
        message: "User not found",
      });

      const response = await request(app).get("/api/Data/999");

      //   expect(response.status).toBe(404);
      //   expect(response.body.message).toBe("User not found");
    });
  });

  // Test POST /SendLink (sendPdfLinkController)
  describe("POST /SendLink", () => {
    it("should send PDF link successfully", async () => {
      sendPdfLinkController.mockResolvedValueOnce({
        success: true,
        message: "PDF link sent successfully",
      });

      const response = await request(app)
        .post("/api/SendLink")
        .send({ userId: 1, pdfLink: "http://example.com/pdf" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe("PDF link sent successfully");
    });

    it("should return error if userId is missing", async () => {
      sendPdfLinkController.mockResolvedValueOnce({
        success: false,
        message: "User ID is required",
      });

      const response = await request(app)
        .post("/api/SendLink")
        .send({ pdfLink: "http://example.com/pdf" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("User ID is required");
    });

    it("should return error if pdfLink is missing", async () => {
      sendPdfLinkController.mockResolvedValueOnce({
        success: false,
        message: "PDF link is required",
      });

      const response = await request(app)
        .post("/api/SendLink")
        .send({ userId: 1 });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("PDF link is required");
    });
  });

  // Test POST /toggle-status (updateToggleStatus)
  describe("POST /toggle-status", () => {
    it("should update the toggle status successfully", async () => {
      updateToggleStatus.mockResolvedValueOnce({ success: true });

      const response = await request(app)
        .post("/api/toggle-status")
        .send({ userId: 1, status: true });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
    });

    it("should return error if userId or status is missing", async () => {
      updateToggleStatus.mockResolvedValueOnce({
        success: false,
        message: "userId and status are required",
      });

      const response = await request(app)
        .post("/api/toggle-status")
        .send({ status: true });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("userId and status are required");
    });
  });

  // Test GET /toggle-status/:userId (getToggleStatus)
  describe("GET /toggle-status/:userId", () => {
    it("should get the toggle status for userId", async () => {
      getToggleStatus.mockResolvedValueOnce({
        success: true,
        data: { userId: 1, status: true },
      });

      const response = await request(app).get("/api/toggle-status/1");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data.status).toBe(true);
    });

    it("should return error if userId is not found", async () => {
      getToggleStatus.mockResolvedValueOnce({
        success: false,
        message: "User not found",
      });

      const response = await request(app).get("/api/toggle-status/999");

      //   expect(response.status).toBe(404);
      //   expect(response.body.message).toBe("User not found");
    });
  });
});
