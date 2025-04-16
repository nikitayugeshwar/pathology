const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const {
  addPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");
const Patient = require("../models/Patient");
const CreateTestReport = require("../models/CreateTestReport");

jest.mock("../models/Patient");
jest.mock("../models/CreateTestReport");

const app = express();
app.use(express.json());
app.post("/addPatient", addPatient);
app.put("/updatePatient/:id", updatePatient);
app.delete("/deletePatient/:id", deletePatient);

describe("Patient Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updatePatient", () => {
    it("should update a patient and return a success response", async () => {
      const mockPatientId = "patient123";
      const mockUpdates = { firstName: "Jane" };

      const mockUpdatedPatient = { _id: mockPatientId, ...mockUpdates };

      Patient.findByIdAndUpdate.mockResolvedValueOnce(mockUpdatedPatient);

      const response = await request(app)
        .put(`/updatePatient/${mockPatientId}`)
        .send(mockUpdates);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Patient and test reports updated successfully"
      );
      expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPatientId,
        mockUpdates,
        { new: true }
      );
    });

    it("should return a 404 error when the patient is not found", async () => {
      const mockPatientId = "patient123";
      const mockUpdates = { firstName: "Jane" };

      Patient.findByIdAndUpdate.mockResolvedValueOnce(null);

      const response = await request(app)
        .put(`/updatePatient/${mockPatientId}`)
        .send(mockUpdates);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Patient not found");
    });
  });

  describe("deletePatient", () => {
    it("should delete a patient and return a success response", async () => {
      const mockPatientId = "patient123";

      const mockDeletedPatient = { _id: mockPatientId, firstName: "John" };

      Patient.findByIdAndDelete.mockResolvedValueOnce(mockDeletedPatient);

      const response = await request(app).delete(
        `/deletePatient/${mockPatientId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Patient deleted successfully");
      expect(Patient.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
    });

    it("should return a 404 error when the patient is not found", async () => {
      const mockPatientId = "patient123";

      Patient.findByIdAndDelete.mockResolvedValueOnce(null);

      const response = await request(app).delete(
        `/deletePatient/${mockPatientId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Patient not found");
    });

    it("should return a 500 error when an exception occurs", async () => {
      const mockPatientId = "patient123";

      Patient.findByIdAndDelete.mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await request(app).delete(
        `/deletePatient/${mockPatientId}`
      );

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Server error. Please try again later."
      );
    });
  });
});
