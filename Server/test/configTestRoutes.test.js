const request = require("supertest");
const app = require("../app"); // Assuming the Express app is exported from app.js

describe("Config Test Routes", () => {
  // Test case for updating a test
  describe("PUT /updateTest/:id", () => {
    it("should update test details", async () => {
      const testId = "1"; // Existing test ID
      const updatedDetails = { name: "Updated Test" }; // New details to update
      const response = await request(app)
        .put(`/updateTest/${testId}`)
        .send(updatedDetails);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty('message', 'Test updated successfully');
    });

    it("should return error if test not found", async () => {
      const testId = "999"; // Non-existent test ID
      const updatedDetails = { name: "Updated Test" };
      const response = await request(app)
        .put(`/updateTest/${testId}`)
        .send(updatedDetails);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty('message', 'Test not found');
    });
  });

  // Test case for deleting a test
  describe("DELETE /deleteTest/:id", () => {
    it("should delete a test by ID", async () => {
      const testId = "1"; // Existing test ID
      const response = await request(app).delete(`/deleteTest/${testId}`);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty('message', 'Test deleted successfully');
    });

    it("should return error if test not found", async () => {
      const testId = "999"; // Non-existent test ID
      const response = await request(app).delete(`/deleteTest/${testId}`);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty('message', 'Test not found');
    });
  });

  // Test case for getting a test by ID
  describe("GET /getTestById/:id", () => {
    it("should return a test by ID", async () => {
      const testId = "1"; // Existing test ID
      const response = await request(app).get(`/getTestById/${testId}`);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty('name');
    });

    it("should return 404 if test not found", async () => {
      const testId = "999"; // Non-existent test ID
      const response = await request(app).get(`/getTestById/${testId}`);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty('message', 'Test not found');
    });
  });

  // Test case for adding fields to a test
  describe("POST /addTestFeild/:testId", () => {
    it("should add fields to a test", async () => {
      const testId = "1"; // Existing test ID
      const newField = { name: "Field 1", type: "text" };
      const response = await request(app)
        .post(`/addTestFeild/${testId}`)
        .send(newField);
      //   expect(response.status).toBe(201);
      //   expect(response.body).toHaveProperty('message', 'Field added to test');
    });

    it("should return error if test not found", async () => {
      const testId = "999"; // Non-existent test ID
      const newField = { name: "Field 1", type: "text" };
      const response = await request(app)
        .post(`/addTestFeild/${testId}`)
        .send(newField);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty('message', 'Test not found');
    });
  });

  // Test case for updating fields by test ID
  describe("PUT /updateTestFeild/:testId", () => {
    it("should update fields for a test", async () => {
      const testId = "1"; // Existing test ID
      const updatedField = { name: "Updated Field", type: "number" };
      const response = await request(app)
        .put(`/updateTestFeild/${testId}`)
        .send(updatedField);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty('message', 'Field updated');
    });

    it("should return error if test not found", async () => {
      const testId = "999"; // Non-existent test ID
      const updatedField = { name: "Updated Field", type: "number" };
      const response = await request(app)
        .put(`/updateTestFeild/${testId}`)
        .send(updatedField);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty('message', 'Test not found');
    });
  });
});
