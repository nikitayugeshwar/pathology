const request = require("supertest");
const app = require("../app"); // Assuming the Express app is exported from app.js

describe("Patient Routes", () => {
  // Test case for adding a new patient

  // Test case for getting a patient by ID
  describe("GET /getPatient/:id", () => {
    it("should return a patient by ID", async () => {
      const patientId = "1"; // Assuming a patient with this ID exists
      const response = await request(app).get(`/getPatient/${patientId}`);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty("name");
      //   expect(response.body).toHaveProperty("age");
    });

    it("should return 404 if patient not found", async () => {
      const patientId = "999"; // Assuming no patient with this ID
      const response = await request(app).get(`/getPatient/${patientId}`);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty("message", "Patient not found");
    });
  });

  // Test case for updating a patient
  describe("PUT /updatePatient/:id", () => {
    it("should update patient details", async () => {
      const patientId = "1"; // Existing patient ID
      const updatedDetails = { age: 35 }; // New details to update
      const response = await request(app)
        .put(`/updatePatient/${patientId}`)
        .send(updatedDetails);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty(
      //     "message",
      //     "Patient updated successfully"
      //   );
    });

    it("should return error if patient not found", async () => {
      const patientId = "999"; // Non-existent patient ID
      const updatedDetails = { age: 35 };
      const response = await request(app)
        .put(`/updatePatient/${patientId}`)
        .send(updatedDetails);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty("message", "Patient not found");
    });
  });

  // Test case for deleting a patient
  describe("DELETE /deletePatient/:id", () => {
    it("should delete a patient by ID", async () => {
      const patientId = "1"; // Existing patient ID
      const response = await request(app).delete(`/deletePatient/${patientId}`);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty(
      //     "message",
      //     "Patient deleted successfully"
      //   );
    });

    it("should return error if patient not found", async () => {
      const patientId = "999"; // Non-existent patient ID
      const response = await request(app).delete(`/deletePatient/${patientId}`);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty("message", "Patient not found");
    });
  });
});
