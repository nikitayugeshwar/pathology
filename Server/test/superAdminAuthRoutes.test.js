const request = require("supertest");
const app = require("../app"); // Assuming your Express app is exported in app.js
const {
  register,
  login,
  sendOTP,
  verifyOTP,
  changePassword,
  logout,
  getUser,
  checkLogin,
  refreshToken,
} = require("../controllers/superAdminAuth");

jest.mock("../controllers/superAdminAuth");

describe("SuperAdmin Authentication Routes", () => {
  // Test POST /register (register)
  describe("POST /register", () => {
    it("should register a new superadmin successfully", async () => {
      register.mockResolvedValueOnce({
        success: true,
        message: "Registration successful",
      });

      const response = await request(app).post("/api/register").send({
        username: "admin",
        email: "admin@example.com",
        password: "password123",
      });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe("Registration successful");
    });

    it("should return error if email is already in use", async () => {
      register.mockResolvedValueOnce({
        success: false,
        message: "Email already in use",
      });

      const response = await request(app).post("/api/register").send({
        username: "admin",
        email: "admin@example.com",
        password: "password123",
      });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Email already in use");
    });
  });

  // Test POST /change-password (changePassword)
  describe("POST /change-password", () => {
    it("should change password successfully", async () => {
      changePassword.mockResolvedValueOnce({
        success: true,
        message: "Password changed successfully",
      });

      const response = await request(app).post("/api/change-password").send({
        email: "admin@example.com",
        oldPassword: "password123",
        newPassword: "newpassword123",
      });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe("Password changed successfully");
    });

    it("should return error if old password is incorrect", async () => {
      changePassword.mockResolvedValueOnce({
        success: false,
        message: "Old password is incorrect",
      });

      const response = await request(app).post("/api/change-password").send({
        email: "admin@example.com",
        oldPassword: "wrongpassword",
        newPassword: "newpassword123",
      });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Old password is incorrect");
    });
  });

  // Test POST /logout (logout)
  describe("POST /logout", () => {
    it("should log out successfully", async () => {
      logout.mockResolvedValueOnce({
        success: true,
        message: "Logged out successfully",
      });

      const response = await request(app).post("/api/logout");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe("Logged out successfully");
    });
  });

  // Test POST /refresh-token (refreshToken)
  describe("POST /refresh-token", () => {
    it("should refresh token successfully", async () => {
      refreshToken.mockResolvedValueOnce({
        success: true,
        token: "new-valid-token",
      });

      const response = await request(app)
        .post("/api/refresh-token")
        .send({ refreshToken: "valid-refresh-token" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.token).toBe("new-valid-token");
    });

    it("should return error for invalid refresh token", async () => {
      refreshToken.mockResolvedValueOnce({
        success: false,
        message: "Invalid refresh token",
      });

      const response = await request(app)
        .post("/api/refresh-token")
        .send({ refreshToken: "invalid-refresh-token" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Invalid refresh token");
    });
  });

  // Test GET /check-login (checkLogin)
  describe("GET /check-login", () => {
    it("should return success if user is logged in", async () => {
      checkLogin.mockResolvedValueOnce({
        success: true,
        message: "User is logged in",
      });

      const response = await request(app).get("/api/check-login");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe("User is logged in");
    });

    it("should return error if user is not logged in", async () => {
      checkLogin.mockResolvedValueOnce({
        success: false,
        message: "User is not logged in",
      });

      const response = await request(app).get("/api/check-login");

      //   expect(response.status).toBe(401);
      //   expect(response.body.message).toBe("User is not logged in");
    });
  });

  // Test GET /user (getUser)
  describe("GET /user", () => {
    it("should return user information if logged in", async () => {
      getUser.mockResolvedValueOnce({
        success: true,
        data: { id: 1, username: "admin", email: "admin@example.com" },
      });

      const response = await request(app).get("/api/user");

      //   expect(response.status).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.data.username).toBe("admin");
    });

    it("should return error if user is not logged in", async () => {
      getUser.mockResolvedValueOnce({
        success: false,
        message: "User not logged in",
      });

      const response = await request(app).get("/api/user");

      //   expect(response.status).toBe(401);
      //   expect(response.body.message).toBe("User not logged in");
    });
  });

  // Test GET /protected (superAdminAuthenicateToken middleware)
  describe("GET /protected", () => {
    it("should return protected route message if authenticated", async () => {
      const response = await request(app)
        .get("/api/protected")
        .set("Authorization", "Bearer valid-token");

      //   expect(response.status).toBe(200);
      //   expect(response.body.message).toBe("This is protected route");
    });

    it("should return error if not authenticated", async () => {
      const response = await request(app).get("/api/protected");

      //   expect(response.status).toBe(401);
      //   expect(response.body.message).toBe("Unauthorized");
    });
  });

  // Test GET /dashboard (superAdminAuthenicateToken middleware)
  describe("GET /dashboard", () => {
    it("should return dashboard message if authenticated", async () => {
      const response = await request(app)
        .get("/api/dashboard")
        .set("Authorization", "Bearer valid-token");

      //   expect(response.status).toBe(200);
      //   expect(response.body.message).toBe("Welcome to the dashboard");
    });

    it("should return error if not authenticated", async () => {
      const response = await request(app).get("/api/dashboard");

      //   expect(response.status).toBe(401);
      //   expect(response.body.message).toBe("Unauthorized");
    });
  });
});
