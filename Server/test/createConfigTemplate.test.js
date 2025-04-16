const cloudinary = require("../config/cloudinary");
const ConfigTemplate = require("../models/ConfigTemplate");
const {
  createConfigTemplate,
} = require("../controllers/configTemplateController");

jest.mock("../config/cloudinary", () => ({
  uploader: {
    upload: jest.fn(),
  },
}));

jest.mock("../models/ConfigTemplate");

describe("createConfigTemplate", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        clinicName: "Test Clinic",
        doctorName: "Dr. Test",
        headerName: "Header",
        subHeaderName: "Subheader",
        footer: "Footer",
        userId: "12345",
        mobile: "9876543210",
      },
      files: {
        logo: [{ path: "path/to/logo" }],
        signature1: [{ path: "path/to/signature1" }],
        signature2: [{ path: "path/to/signature2" }],
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    cloudinary.uploader.upload.mockResolvedValue({
      secure_url: "http://cloudinary.com/image.png",
    });
    ConfigTemplate.prototype.save = jest.fn().mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a config template and return 201 status", async () => {
    await createConfigTemplate(req, res);

    expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(3);
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith("path/to/logo");
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      "path/to/signature1"
    );
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      "path/to/signature2"
    );

    expect(ConfigTemplate).toHaveBeenCalledWith({
      clinicName: "Test Clinic",
      doctorName: "Dr. Test",
      mobile: "9876543210",
      headerName: "Header",
      subHeaderName: "Subheader",
      footer: "Footer",
      userId: "12345",
      logo: "http://cloudinary.com/image.png",
      signature1: "http://cloudinary.com/image.png",
      signature2: "http://cloudinary.com/image.png",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Config template created successfully",
      configTemplate: expect.any(Object),
    });
  });

  it("should return 400 if clinicName is missing", async () => {
    req.body.clinicName = null;

    await createConfigTemplate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Clinic Name, Test ID, and Test Name are required",
    });
  });

  it("should return 500 if an error occurs", async () => {
    ConfigTemplate.prototype.save.mockRejectedValue(
      new Error("Database error")
    );

    await createConfigTemplate(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });
});
