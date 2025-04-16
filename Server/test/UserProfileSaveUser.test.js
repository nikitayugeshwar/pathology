const { saveUser } = require("../controllers/userProfileController");
const UsersProfile = require("../models/userProfile");

jest.mock("../models/userProfile"); // This mocks the entire UsersProfile model

describe("saveUser Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userId: "123", // default valid userId
        email: "test@example.com", // default valid email
        password: "password123", // default valid password
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset the mocks before each test
    UsersProfile.findOne.mockReset();
    UsersProfile.prototype.save.mockReset();
  });

  test("should return 400 if any required field is missing", async () => {
    req.body = { userId: "123", email: "test@example.com" }; // Missing password
    await saveUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });

    req.body = { userId: "123", password: "password123" }; // Missing email
    await saveUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });

    req.body = { email: "test@example.com", password: "password123" }; // Missing userId
    await saveUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  test("should update existing user profile", async () => {
    req.body = {
      userId: "123",
      email: "newemail@example.com",
      password: "newpassword123",
    };

    // Mock UsersProfile.findOne to simulate an existing user
    UsersProfile.findOne.mockResolvedValue({
      userId: "123",
      email: "oldemail@example.com",
      password: "oldpassword123",
      save: jest.fn().mockResolvedValue({}),
    });

    await saveUser(req, res);

    expect(UsersProfile.findOne).toHaveBeenCalledWith({ userId: "123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User profile updated successfully",
    });
  });

  test("should create new user profile", async () => {
    req.body = {
      userId: "456",
      email: "newuser@example.com",
      password: "newpassword123",
    };

    // Mock UsersProfile.findOne to simulate no existing user
    UsersProfile.findOne.mockResolvedValue(null);

    // Mock the save function
    UsersProfile.prototype.save.mockResolvedValue({});

    await saveUser(req, res);

    expect(UsersProfile.findOne).toHaveBeenCalledWith({ userId: "456" });
    expect(UsersProfile.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User profile saved successfully",
    });
  });

  test("should return 500 for server errors", async () => {
    req.body = {
      userId: "123",
      email: "test@example.com",
      password: "password123",
    };

    // Simulate a server error in UsersProfile.findOne
    UsersProfile.findOne.mockRejectedValue(new Error("Database error"));

    await saveUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });

  test("should not save if user profile data is the same", async () => {
    req.body = {
      userId: "123",
      email: "existinguser@example.com",
      password: "existingpassword123",
    };

    // Simulate an existing user with the same data
    UsersProfile.findOne.mockResolvedValue({
      userId: "123",
      email: "existinguser@example.com",
      password: "existingpassword123",
      save: jest.fn(),
    });

    await saveUser(req, res);

    expect(UsersProfile.findOne).toHaveBeenCalledWith({ userId: "123" });
    expect(UsersProfile.prototype.save).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User profile updated successfully",
    });
  });

  test("should return 200 for successful profile update", async () => {
    req.body = {
      userId: "123",
      email: "updateduser@example.com",
      password: "newpassword123",
    };

    // Simulate an existing user profile
    UsersProfile.findOne.mockResolvedValue({
      userId: "123",
      email: "olduser@example.com",
      password: "oldpassword123",
      save: jest.fn().mockResolvedValue({}),
    });

    await saveUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User profile updated successfully",
    });
  });

  test("should return 201 for successful new user profile creation", async () => {
    req.body = {
      userId: "456",
      email: "newuser@example.com",
      password: "newpassword123",
    };

    // Mock UsersProfile.findOne to simulate no existing user
    UsersProfile.findOne.mockResolvedValue(null);

    const saveStub = jest.fn().mockResolvedValue({});
    UsersProfile.prototype.save = saveStub;

    await saveUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User profile saved successfully",
    });
  });
});
