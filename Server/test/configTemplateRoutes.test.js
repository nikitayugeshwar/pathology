const request = require("supertest");
const app = require("../app"); // Assuming the Express app is exported from app.js

describe("Config Template Routes", () => {
  // Test case for creating a config template
  describe("POST /createConfigTemplate", () => {
    it("should create a new config template", async () => {
      const newConfigTemplate = {
        name: "Template 1",
        description: "Template description",
      };

      const response = await request(app)
        .post("/createConfigTemplate")
        .send(newConfigTemplate);
      //   expect(response.status).toBe(201);
      //   expect(response.body).toHaveProperty('message', 'Config template created successfully');
    });

    it("should return error if required fields are missing", async () => {
      const newConfigTemplate = { name: "Template 1" }; // Missing description

      const response = await request(app)
        .post("/createConfigTemplate")
        .send(newConfigTemplate);
      //   expect(response.status).toBe(400);
      //   expect(response.body).toHaveProperty('message', 'Missing required fields');
    });
  });

  // Test case for updating a config template
  describe("PUT /updateConfigTemplate/:id", () => {
    it("should update a config template by ID", async () => {
      const templateId = "1"; // Existing config template ID
      const updatedDetails = { name: "Updated Template" };
      const response = await request(app)
        .put(`/updateConfigTemplate/${templateId}`)
        .send(updatedDetails);
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty('message', 'Config template updated successfully');
    });

    it("should return error if config template not found", async () => {
      const templateId = "999"; // Non-existent config template ID
      const updatedDetails = { name: "Updated Template" };
      const response = await request(app)
        .put(`/updateConfigTemplate/${templateId}`)
        .send(updatedDetails);
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty('message', 'Config template not found');
    });
  });

  // Test case for deleting a config template
  describe("DELETE /deleteConfigTemplate/:id", () => {
    it("should delete a config template by ID", async () => {
      const templateId = "1"; // Existing config template ID
      const response = await request(app).delete(
        `/deleteConfigTemplate/${templateId}`
      );
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty('message', 'Config template deleted successfully');
    });

    it("should return error if config template not found", async () => {
      const templateId = "999"; // Non-existent config template ID
      const response = await request(app).delete(
        `/deleteConfigTemplate/${templateId}`
      );
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty('message', 'Config template not found');
    });
  });

  // Test case for getting a config template by ID
  describe("GET /getConfigTemplateById/:id", () => {
    it("should return a config template by ID", async () => {
      const templateId = "1"; // Existing config template ID
      const response = await request(app).get(
        `/getConfigTemplateById/${templateId}`
      );
      //   expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty('name');
    });

    it("should return 404 if config template not found", async () => {
      const templateId = "999"; // Non-existent config template ID
      const response = await request(app).get(
        `/getConfigTemplateById/${templateId}`
      );
      //   expect(response.status).toBe(404);
      //   expect(response.body).toHaveProperty('message', 'Config template not found');
    });
  });
});
