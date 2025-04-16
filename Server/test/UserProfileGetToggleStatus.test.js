const { getToggleStatus } = require("../controllers/userProfileController");
const UsersProfile = require("../models/userProfile"); // Mock this model
const httpMocks = require("node-mocks-http");

jest.mock("../models/userProfile");

describe("getToggleStatus", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should retrieve toggle statuses successfully", async () => {
    req.params = { userId: "user123" };

    UsersProfile.findOne.mockResolvedValue({
      userId: "user123",
      whatsappActive: true,
      twilioActive: false,
      emailActive: true,
    });

    await getToggleStatus(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      whatsapp: true,
      twilio: false,
      email: true,
    });
  });

  test("should return 400 if userId is missing", async () => {
    req.params = {};

    await getToggleStatus(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "User ID is required" });
  });

  test("should return 404 if user is not found", async () => {
    req.params = { userId: "user123" };

    UsersProfile.findOne.mockResolvedValue(null);

    await getToggleStatus(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: "User not found" });
  });

  test("should default toggle statuses to false if fields are missing", async () => {
    req.params = { userId: "user123" };

    UsersProfile.findOne.mockResolvedValue({
      userId: "user123",
      whatsappActive: undefined,
      twilioActive: undefined,
      emailActive: undefined,
    });

    await getToggleStatus(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      whatsapp: false,
      twilio: false,
      email: false,
    });
  });

  test("should handle database errors gracefully", async () => {
    req.params = { userId: "user123" };

    UsersProfile.findOne.mockRejectedValue(new Error("Database error"));

    await getToggleStatus(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Internal server error" });
  });
});
