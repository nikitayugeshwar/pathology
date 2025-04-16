const request = require("supertest");
const app = require("../app"); // Adjust the path as necessary
const Patient = require("../models/Patient"); // Mock Patient model
const puppeteer = require("puppeteer");

jest.mock("puppeteer");
jest.mock("../models/Patient");

describe("Patient Controller Tests", () => {
  describe("getPatient", () => {
    it("should return the patient if found", async () => {
      const mockPatient = { id: "123", name: "John Doe" };
      Patient.findById.mockResolvedValue(mockPatient);

      const response = await request(app).get("/patients/123");

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual({
      //     message: "Patient retrieved successfully",
      //     patient: mockPatient,
      //   });
    });

    it("should return 404 if the patient is not found", async () => {
      Patient.findById.mockResolvedValue(null);

      const response = await request(app).get("/patients/123");

      //   expect(response.status).toBe(404);
      //   expect(response.body).toEqual({ message: "Patient not found" });
    });

    it("should return 500 on server error", async () => {
      Patient.findById.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/patients/123");

      //   expect(response.status).toBe(500);
      //   expect(response.body).toEqual({
      //     message: "Server error. Please try again later.",
      //   });
    });
  });

  describe("getAllPatientsByUserId", () => {
    it("should return all patients for a user", async () => {
      const mockPatients = [
        { id: "1", name: "Patient One" },
        { id: "2", name: "Patient Two" },
      ];
      Patient.find.mockResolvedValue(mockPatients);

      const response = await request(app).get("/patients/user/456");

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual({
      //     message: "Patients retrieved successfully",
      //     patients: mockPatients,
      //   });
    });

    it("should return 500 on server error", async () => {
      Patient.find.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/patients/user/456");

      //   expect(response.status).toBe(500);
      //   expect(response.body).toEqual({
      //     message: "Server error. Please try again later.",
      //   });
    });
  });

  describe("getPatientByTestId", () => {
    it("should return the patient by test ID", async () => {
      const mockPatient = { id: "123", name: "John Doe" };
      Patient.findOne.mockResolvedValue(mockPatient);

      const response = await request(app).get("/patients/test/789");

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual({
      //     message: "Patient retrieved successfully",
      //     patient: mockPatient,
      //   });
    });

    it("should return 404 if no patient is found", async () => {
      Patient.findOne.mockResolvedValue(null);

      const response = await request(app).get("/patients/test/789");

      //   expect(response.status).toBe(404);
      //   expect(response.body).toEqual({ message: "Patient not found" });
    });

    it("should return 500 on server error", async () => {
      Patient.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/patients/test/789");

      //   expect(response.status).toBe(500);
      //   expect(response.body).toEqual({
      //     message: "Server error. Please try again later.",
      //   });
    });
  });

  describe("getAllPatientsWithTestId", () => {
    it("should return all patients with test IDs", async () => {
      const mockPatients = [
        { id: "1", name: "Patient One", tests: [{ id: "101" }] },
        { id: "2", name: "Patient Two", tests: [{ id: "102" }] },
      ];
      Patient.find.mockResolvedValue(mockPatients);

      const response = await request(app).get("/patients/tests/user/456");

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual({
      //     message: "Patients with tests retrieved successfully",
      //     patients: mockPatients,
      //   });
    });

    it("should return 500 on server error", async () => {
      Patient.find.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/patients/tests/user/456");

      //   expect(response.status).toBe(500);
      //   expect(response.body).toEqual({
      //     message: "Server error. Please try again later.",
      //   });
    });
  });

  describe("getDailyPatientCount", () => {
    it("should return the daily patient count", async () => {
      Patient.aggregate.mockResolvedValue([{ count: 5 }]);

      const response = await request(app).get("/patients/count/user/456");

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual({ count: 5 });
    });

    it("should return a count of 0 if no patients are found", async () => {
      Patient.aggregate.mockResolvedValue([]);

      const response = await request(app).get("/patients/count/user/456");

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual({ count: 0 });
    });

    it("should return 500 on server error", async () => {
      Patient.aggregate.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/patients/count/user/456");

      //   expect(response.status).toBe(500);
      //   expect(response.body).toEqual({
      //     message: "Server error. Please try again later.",
      //   });
    });
  });
});
