const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { register } = require("../controllers/superAdminAuth"); // Adjust this import path

describe("Register User Tests", () => {
  
  // Increase the global timeout for all tests
  jest.setTimeout(10000); // 10 seconds timeout for all tests

  // Test Case: Successful Registration
  it("should successfully register a new user", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        mobile: "1234567890",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(null); // No user found by email or mobile
    jest.spyOn(bcrypt, "genSalt").mockResolvedValue("salt");
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");
    jest.spyOn(jwt, "sign").mockReturnValue("accessToken");
    jest.spyOn(User.prototype, "save").mockResolvedValue({ ...req.body, _id: "newId" });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      user: { ...req.body, _id: "newId" },
    });

    User.findOne.mockRestore();
    bcrypt.genSalt.mockRestore();
    bcrypt.hash.mockRestore();
    jwt.sign.mockRestore();
    User.prototype.save.mockRestore();
  });

  // Test Case: Email Already Registered
  it("should return an error if email is already registered", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "existingemail@example.com",
        mobile: "1234567890",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue({ email: req.body.email });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email is already registered" });

    User.findOne.mockRestore();
  });

  // Test Case: Mobile Number Already Registered
  it("should return an error if mobile number is already registered", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "newemail@example.com",
        mobile: "existingmobile",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue({ mobile: req.body.mobile });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    // expect(res.json).toHaveBeenCalledWith({ message: "Mobile number is already registered" });

    User.findOne.mockRestore();
  });

  

  // Test Case: JWT Signing Fails
  it("should return an error if JWT signing fails", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        mobile: "1234567890",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(null);
    jest.spyOn(bcrypt, "genSalt").mockResolvedValue("salt");
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");
    jest.spyOn(jwt, "sign").mockImplementation(() => {
      throw new Error("JWT error");
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "JWT error" });

    User.findOne.mockRestore();
    bcrypt.genSalt.mockRestore();
    bcrypt.hash.mockRestore();
    jwt.sign.mockRestore();
  });

  // Test Case: Server Error (General Error Handling)
  it("should return a 400 status code if any error occurs", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        mobile: "1234567890",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(User, "findOne").mockRejectedValue(new Error("Database error"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Database error" });

    User.findOne.mockRestore();
  });

  // Test Case: Missing Input Data
//   it("should return an error if required input fields are missing", async () => {
//     const req = {
//       body: {
//         name: "John Doe",
//         // Missing email and password
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     await register(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ message: "Email and password are required" });
//   });

  

});
