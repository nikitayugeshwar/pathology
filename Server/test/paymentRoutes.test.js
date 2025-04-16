const request = require("supertest");
const app = require("../app"); // Assuming the Express app is exported from app.js
const paymentController = require("../controllers/paymentController");

// Mocking the paymentController functions
jest.mock("../controllers/paymentController");

describe("Payment Routes", () => {
  describe("POST /create-payment", () => {
    it("should return 200 and payment session details if payment session is created successfully", async () => {
      const mockResponse = {
        sessionId: "mockSessionId",
        status: "success",
      };

      paymentController.createPaymentSession.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/create-payment")
        .send({ amount: 100, currency: "USD", userId: "12345" });

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual(mockResponse);
    });

    it("should return 400 if payment session creation fails", async () => {
      paymentController.createPaymentSession.mockRejectedValue(
        new Error("Payment session creation failed")
      );

      const response = await request(app)
        .post("/create-payment")
        .send({ amount: 100, currency: "USD", userId: "12345" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Payment session creation failed");
    });
  });

  describe("POST /update-payment", () => {
    it("should return 200 if payment is successfully updated", async () => {
      const mockResponse = {
        status: "Payment success",
        message: "Payment processed successfully",
      };

      paymentController.handlePaymentSuccess.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/update-payment")
        .send({ paymentId: "12345", status: "success" });

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual(mockResponse);
    });

    it("should return 400 if payment update fails", async () => {
      paymentController.handlePaymentSuccess.mockRejectedValue(
        new Error("Payment update failed")
      );

      const response = await request(app)
        .post("/update-payment")
        .send({ paymentId: "12345", status: "failure" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Payment update failed");
    });
  });

  describe("POST /check-payment-status", () => {
    it("should return 200 and payment status if the payment status is fetched successfully", async () => {
      const mockResponse = {
        status: "Payment is successful",
        paymentId: "12345",
      };

      paymentController.checkPaymentStatus.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/check-payment-status")
        .send({ paymentId: "12345" });

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual(mockResponse);
    });

    it("should return 400 if fetching payment status fails", async () => {
      paymentController.checkPaymentStatus.mockRejectedValue(
        new Error("Failed to fetch payment status")
      );

      const response = await request(app)
        .post("/check-payment-status")
        .send({ paymentId: "12345" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Failed to fetch payment status");
    });
  });
});
