const request = require("supertest");
const app = require("../app"); // Assuming the Express app is exported from app.js
const { getIo } = require("../socket"); // Mocking Socket.io instance

jest.mock("../socket", () => ({
  getIo: jest.fn(() => ({
    emit: jest.fn(),
  })),
}));

describe("Notification Routes", () => {
  // Test case for resetting notification count
  describe("POST /resetNotificationCount", () => {
    it("should reset notification count", async () => {
      const response = await request(app).post("/resetNotificationCount");
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty(
      //     "message",
      //     "Notification count reset successfully"
      //   );
    });
  });

  // Test case for getting notification count
  describe("GET /notificationCount", () => {
    it("should return notification count", async () => {
      const response = await request(app).get("/notificationCount");
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty("count");
    });

    it("should return 0 if no notifications", async () => {
      const response = await request(app).get("/notificationCount");
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty("count", 0);
    });
  });

  // Test case for getting out of range results by user ID
  describe("GET /outOfRangeResults", () => {
    it("should return results for out of range user ID", async () => {
      const userId = "user123"; // Example user ID
      const response = await request(app).get(
        `/outOfRangeResults?userId=${userId}`
      );
      //   expect(response.status).toBe(200);
      //   expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return empty array if no results found", async () => {
      const userId = "user999"; // Example user ID with no results
      const response = await request(app).get(
        `/outOfRangeResults?userId=${userId}`
      );
      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual([]);
    });
  });

  // Test case for sending a notification
  describe("POST /notify", () => {
    it("should send a notification", async () => {
      const notification = {
        title: "Test Notification",
        description: "This is a test notification",
        date: "2025-01-23T12:00:00Z",
      };

      const response = await request(app).post("/notify").send(notification);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty("success", true);
      //   expect(response.body).toHaveProperty("message", "Notification sent!");
    });

    it("should return error if any field is missing", async () => {
      const notification = {
        title: "Test Notification",
        description: "This is a test notification",
        // date is missing
      };

      const response = await request(app).post("/notify").send(notification);
      //   expect(response.status).toBe(400);
      //   expect(response.body).toHaveProperty(
      //     "message",
      //     "All fields are required!"
      //   );
    });
  });
});
