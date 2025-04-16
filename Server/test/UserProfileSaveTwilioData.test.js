const twilio = require("twilio");
const UsersProfile = require("../models/userProfile");
const { saveTwilioData } = require("../controllers/userProfileController");

jest.mock("twilio");
jest.mock("../models/userProfile");

describe("saveTwilioData Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userId: "123",
        twilioSid: "testSid",
        twilioAuthToken: "testAuthToken",
        twilioActiveNumber: "+1234567890",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset mocks before each test
    twilio.mockReset();
    UsersProfile.findOne.mockReset();
    UsersProfile.prototype.save.mockReset();
  });

  test("should return 400 if any required field is missing", async () => {
    req.body = {
      userId: "123",
      twilioSid: "testSid",
      twilioAuthToken: "testAuthToken",
    }; // Missing twilioActiveNumber
    await saveTwilioData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  test("should return 400 if Twilio active number is not valid or not associated", async () => {
    twilio.mockImplementation(() => ({
      incomingPhoneNumbers: {
        list: jest.fn().mockResolvedValue([{ phoneNumber: "+0987654321" }]),
      },
    }));

    await saveTwilioData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Twilio active number is not valid or not associated with the provided account.",
    });
  });

  test("should return 500 if Twilio verification fails", async () => {
    twilio.mockImplementation(() => ({
      incomingPhoneNumbers: {
        list: jest.fn().mockRejectedValue(new Error("API error")),
      },
    }));

    await saveTwilioData(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Twilio verification failed",
      error: "API error",
    });
  });

  test("should return 400 if Twilio active number is invalid", async () => {
    twilio.mockImplementation(() => ({
      incomingPhoneNumbers: {
        list: jest.fn().mockResolvedValue([{ phoneNumber: "+9876543210" }]),
      },
    }));

    await saveTwilioData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Twilio active number is not valid or not associated with the provided account.",
    });
  });

  test("should handle empty list from Twilio API gracefully", async () => {
    twilio.mockImplementation(() => ({
      incomingPhoneNumbers: { list: jest.fn().mockResolvedValue([]) },
    }));

    await saveTwilioData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Twilio active number is not valid or not associated with the provided account.",
    });
  });

  test("should return 400 if userId is missing", async () => {
    req.body = {
      twilioSid: "testSid",
      twilioAuthToken: "testAuthToken",
      twilioActiveNumber: "+1234567890",
    };
    await saveTwilioData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });
});
