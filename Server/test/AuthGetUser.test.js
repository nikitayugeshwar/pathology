const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const Superadmin = require("../models/superadmin"); // Mocked Superadmin model
const { getUser } = require("../controllers/authController");

describe("Get User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {
        userToken: "validToken", // Simulate valid token in cookies
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    sinon.restore(); // Reset all Sinon stubs after each test
  });

  test("should return 500 if JWT token is invalid", async () => {
    // Simulate invalid token
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });

  test("should return 401 if no token is provided", async () => {
    req.cookies = {}; // No token in cookies

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized",
    });
  });

  test("should return 500 if there is a database error", async () => {
    // Simulate valid token and user retrieval
    sinon.stub(jwt, "verify").returns({ id: "123" });

    // Simulate database error
    sinon.stub(Superadmin, "findById").throws(new Error("Database error"));

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });

  test("should throw error if JWT_SECRET is missing in environment variables", async () => {
    process.env.JWT_SECRET = ""; // Unset the environment variable

    // Simulate valid token and user retrieval
    sinon.stub(jwt, "verify").returns({ id: "123" });

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });

  test("should return 401 if JWT token is expired", async () => {
    // Simulate an expired token
    const expiredToken = "expiredToken";
    sinon.stub(req.cookies, "userToken").value(expiredToken);

    // Simulate token verification error for expired token
    sinon.stub(jwt, "verify").throws(new jwt.JsonWebTokenError("jwt expired"));

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401); // Expect 401 for expired token
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized",
    });
  });
});
