const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const Superadmin = require("../models/superadmin"); // Mocked Superadmin model
const { login } = require("../controllers/authController");

describe("Login Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "admin@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    sinon.restore(); // Reset all Sinon stubs after each test
  });

  test("should return 400 if user is not found", async () => {
    sinon.stub(Superadmin, "findOne").resolves(null); // Simulate user not found

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  test("should return 403 if user is not active", async () => {
    sinon.stub(Superadmin, "findOne").resolves({ active: false }); // Simulate inactive user

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "User is not active" });
  });

  test("should return 400 for invalid password", async () => {
    sinon
      .stub(Superadmin, "findOne")
      .resolves({ active: true, password: "wrongpassword" }); // Simulate valid user

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  test("should return 200 and set cookies on successful login", async () => {
    const user = {
      _id: "123",
      email: "admin@example.com",
      password: "password123",
      active: true,
    };
    sinon.stub(Superadmin, "findOne").resolves(user); // Simulate valid user

    sinon
      .stub(jwt, "sign")
      .onFirstCall()
      .returns("mockToken")
      .onSecondCall()
      .returns("mockRefreshToken"); // Mock JWT token generation

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login successful",
        token: "mockToken",
      })
    );

    // Update to match the actual arguments passed to res.cookie
    expect(res.cookie).toHaveBeenCalledWith(
      "userToken",
      "mockToken",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      })
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "userRefreshToken",
      "mockRefreshToken",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      })
    );
  });
});
