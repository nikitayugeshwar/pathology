const sinon = require("sinon");
const { logout } = require("../controllers/authController");

describe("Logout Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {}; // Simulate an empty request object
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should return 200 and success message on successful logout", () => {
    logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
  });

  test("should clear the userToken and userRefreshToken cookies", () => {
    logout(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      "userToken",
      "",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "strict",
        expires: new Date(0),
      })
    );

    expect(res.cookie).toHaveBeenCalledWith(
      "userRefreshToken",
      "",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "strict",
        expires: new Date(0),
      })
    );
  });

  test("should set cookies with correct attributes", () => {
    logout(req, res);

    const cookieOptions = {
      httpOnly: true,
      secure: expect.any(Boolean),
      sameSite: "strict",
      expires: new Date(0),
    };

    // Test userToken cookie
    expect(res.cookie).toHaveBeenCalledWith("userToken", "", cookieOptions);

    // Test userRefreshToken cookie
    expect(res.cookie).toHaveBeenCalledWith(
      "userRefreshToken",
      "",
      cookieOptions
    );
  });

  test("should work correctly in production environment", () => {
    process.env.NODE_ENV = "production"; // Set environment to production

    logout(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      "userToken",
      "",
      expect.objectContaining({
        secure: true, // Secure should be true in production
      })
    );

    expect(res.cookie).toHaveBeenCalledWith(
      "userRefreshToken",
      "",
      expect.objectContaining({
        secure: true, // Secure should be true in production
      })
    );
  });

  test("should work correctly in non-production environment", () => {
    process.env.NODE_ENV = "development"; // Set environment to development

    logout(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      "userToken",
      "",
      expect.objectContaining({
        secure: false, // Secure should be false in non-production
      })
    );

    expect(res.cookie).toHaveBeenCalledWith(
      "userRefreshToken",
      "",
      expect.objectContaining({
        secure: false, // Secure should be false in non-production
      })
    );
  });

  test("should not throw an error if cookies are not set initially", () => {
    req.cookies = {}; // No cookies set

    expect(() => logout(req, res)).not.toThrow();
  });
});
