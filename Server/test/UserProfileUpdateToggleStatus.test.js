const { updateToggleStatus } = require("../controllers/userProfileController");
const UsersProfile = require("../models/userProfile"); // Mock this model
const httpMocks = require("node-mocks-http");

jest.mock("../models/userProfile");

describe("updateToggleStatus", () => {
  let req, res;

  beforeEach(() => {

    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should update status successfully", async () => {
    req.body = {
      userId: "user123",
      toggleKey: "whatsapp",
      status: true,
    };

    UsersProfile.updateOne.mockResolvedValue({ nModified: 1 });

    await updateToggleStatus(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: "Status updated successfully" });
  });

  test("should return 400 if userId is missing", async () => {
    req.body = { toggleKey: "whatsapp", status: true };

    await updateToggleStatus(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Invalid request data" });
  });

  test("should return 400 if toggleKey is missing", async () => {
    req.body = { userId: "user123", status: true };

    await updateToggleStatus(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Invalid request data" });
  });

  test("should return 400 if status is missing", async () => {
    req.body = { userId: "user123", toggleKey: "whatsapp" };

    await updateToggleStatus(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Invalid request data" });
  });

  test("should return 400 if status is not a boolean", async () => {
    req.body = { userId: "user123", toggleKey: "whatsapp", status: "true" };

    await updateToggleStatus(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Invalid request data" });
  });

  test("should return 404 if no user found or no changes made", async () => {
    req.body = {
      userId: "user123",
      toggleKey: "whatsapp",
      status: true,
    };

    UsersProfile.updateOne.mockResolvedValue({ nModified: 0 });

    await updateToggleStatus(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "User not found or no changes made",
    });
  });

  test("should handle database errors gracefully", async () => {
    req.body = {
      userId: "user123",
      toggleKey: "whatsapp",
      status: true,
    };

    UsersProfile.updateOne.mockRejectedValue(new Error("Database error"));

    await updateToggleStatus(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Internal server error" });
  });
});
