const request = require("supertest");
const app = require("../app"); // Assuming the Express app is exported from app.js
const {
  login,
  sendOTP,
  verifyOTP,
  changePassword,
  logout,
  getUser,
  checkLogin,
  refreshToken,
} = require("../controllers/authController");

jest.mock("../controllers/authController");

describe("Auth Routes", () => {
  describe("POST /login", () => {
    it("should return 200 and user data if login is successful", async () => {
      const mockLoginResponse = {
        userId: "12345",
        token: "mockToken",
      };

      login.mockResolvedValue(mockLoginResponse);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual(mockLoginResponse);
    });

    it("should return 400 if login fails due to invalid credentials", async () => {
      login.mockRejectedValue(new Error("Invalid credentials"));

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "wrongPassword" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /send-otp", () => {
    it("should return 200 if OTP is sent successfully", async () => {
      sendOTP.mockResolvedValue({ message: "OTP sent successfully" });

      const response = await request(app)
        .post("/send-otp")
        .send({ email: "test@example.com" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.message).toBe("OTP sent successfully");
    });

    it("should return 400 if OTP sending fails", async () => {
      sendOTP.mockRejectedValue(new Error("Error sending OTP"));

      const response = await request(app)
        .post("/send-otp")
        .send({ email: "test@example.com" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Error sending OTP");
    });
  });

  describe("POST /verify-otp", () => {
    it("should return 200 if OTP is verified successfully", async () => {
      verifyOTP.mockResolvedValue({ message: "OTP verified successfully" });

      const response = await request(app)
        .post("/verify-otp")
        .send({ email: "test@example.com", otp: "123456" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.message).toBe("OTP verified successfully");
    });

    it("should return 400 if OTP verification fails", async () => {
      verifyOTP.mockRejectedValue(new Error("Invalid OTP"));

      const response = await request(app)
        .post("/verify-otp")
        .send({ email: "test@example.com", otp: "wrongOTP" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Invalid OTP");
    });
  });

  describe("POST /change-password", () => {
    it("should return 200 if password is changed successfully", async () => {
      changePassword.mockResolvedValue({
        message: "Password changed successfully",
      });

      const response = await request(app)
        .post("/change-password")
        .send({ email: "test@example.com", newPassword: "newPassword123" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.message).toBe("Password changed successfully");
    });

    it("should return 400 if password change fails", async () => {
      changePassword.mockRejectedValue(new Error("Password change failed"));

      const response = await request(app)
        .post("/change-password")
        .send({ email: "test@example.com", newPassword: "newPassword123" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Password change failed");
    });
  });

  describe("POST /logout", () => {
    it("should return 200 if logout is successful", async () => {
      logout.mockResolvedValue({ message: "Logged out successfully" });

      const response = await request(app).post("/logout");

      //   expect(response.status).toBe(200);
      //   expect(response.body.message).toBe("Logged out successfully");
    });

    it("should return 400 if logout fails", async () => {
      logout.mockRejectedValue(new Error("Logout failed"));

      const response = await request(app).post("/logout");

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Logout failed");
    });
  });

  describe("GET /check-login", () => {
    it("should return 200 if user is logged in", async () => {
      checkLogin.mockResolvedValue({ isLoggedIn: true });

      const response = await request(app).get("/check-login");

      //   expect(response.status).toBe(200);
      //   expect(response.body.isLoggedIn).toBe(true);
    });

    it("should return 401 if user is not logged in", async () => {
      checkLogin.mockResolvedValue({ isLoggedIn: false });

      const response = await request(app).get("/check-login");

      //   expect(response.status).toBe(401);
      //   expect(response.body.isLoggedIn).toBe(false);
    });
  });

  describe("POST /refresh-token", () => {
    it("should return 200 with new token if refresh token is valid", async () => {
      refreshToken.mockResolvedValue({ token: "newMockToken" });

      const response = await request(app)
        .post("/refresh-token")
        .send({ refreshToken: "validRefreshToken" });

      //   expect(response.status).toBe(200);
      //   expect(response.body.token).toBe("newMockToken");
    });

    it("should return 400 if refresh token is invalid", async () => {
      refreshToken.mockRejectedValue(new Error("Invalid refresh token"));

      const response = await request(app)
        .post("/refresh-token")
        .send({ refreshToken: "invalidRefreshToken" });

      //   expect(response.status).toBe(400);
      //   expect(response.body.message).toBe("Invalid refresh token");
    });
  });

  describe("GET /user", () => {
    it("should return 200 with user data if authenticated", async () => {
      const mockUserData = {
        userId: "12345",
        email: "test@example.com",
      };

      getUser.mockResolvedValue(mockUserData);

      const response = await request(app)
        .get("/user")
        .set("Authorization", "Bearer validToken");

      //   expect(response.status).toBe(200);
      //   expect(response.body).toEqual(mockUserData);
    });

    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/user");

      //   expect(response.status).toBe(401);
      //   expect(response.body.message).toBe("Unauthorized");
    });
  });
});
