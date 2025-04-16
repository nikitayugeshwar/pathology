const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const { checkLogin } = require("../controllers/authController");

describe("Check Login Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should return 200 and userId if token is valid", async () => {
    // Simulate a valid token
    const decoded = { id: "123" };
    const validToken = "validToken";
    req.cookies = { token: validToken };

    // Stub jwt.verify to simulate successful decoding
    sinon.stub(jwt, "verify").returns(decoded);

    await checkLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already logged in",
      userId: "123",
    });

    // Restore the original behavior of jwt.verify
    sinon.restore();
  });

  test("should return 401 and 'Invalid token' if token is invalid", async () => {
    // Simulate an invalid token
    const invalidToken = "invalidToken";
    req.cookies = { token: invalidToken };

    // Stub jwt.verify to throw an error
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    await checkLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });

    // Restore the original behavior of jwt.verify
    sinon.restore();
  });

  test("should return 401 and 'User not logged in' if no token is provided", async () => {
    req.cookies = {}; // No token in cookies

    await checkLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not logged in" });
  });

  test("should return 401 and 'Invalid token' if token verification fails", async () => {
    // Simulate a failed verification scenario
    const failedToken = "failedToken";
    req.cookies = { token: failedToken };

    // Stub jwt.verify to throw an error
    sinon
      .stub(jwt, "verify")
      .throws(new jwt.JsonWebTokenError("jwt malformed"));

    await checkLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });

    // Restore the original behavior of jwt.verify
    sinon.restore();
  });

  test("should handle missing JWT_SECRET environment variable gracefully", async () => {
    process.env.JWT_SECRET = ""; // Unset the environment variable

    const validToken = "validToken";
    req.cookies = { token: validToken };

    // Stub jwt.verify to simulate successful decoding
    sinon.stub(jwt, "verify").returns({ id: "123" });

    await checkLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already logged in",
      userId: "123",
    });

    // Restore the original behavior of jwt.verify
    sinon.restore();
  });
});
