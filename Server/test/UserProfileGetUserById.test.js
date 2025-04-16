const { getUserById } = require("../controllers/userProfileController");
const UsersProfile = require("../models/userProfile");

jest.mock("../models/userProfile");

describe("getUserById Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { userId: "123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset mocks before each test
    UsersProfile.findOne.mockReset();
  });

  test("should return 200 and user data when user is found", async () => {
    const mockUser = { userId: "123", name: "John Doe" };
    UsersProfile.findOne.mockResolvedValue(mockUser);

    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("should return 404 if user is not found", async () => {
    UsersProfile.findOne.mockResolvedValue(null);

    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  test("should return 500 if server error occurs", async () => {
    UsersProfile.findOne.mockRejectedValue(new Error("Database error"));

    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });

  test("should return 500 if database query throws error", async () => {
    UsersProfile.findOne.mockRejectedValue(new Error("Database query failed"));

    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
