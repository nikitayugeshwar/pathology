const cloudinary = require("../config/cloudinary");
const ConfigTemplate = require("../models/ConfigTemplate");
const {
  updateConfigTemplate,
  deleteConfigTemplate,
} = require("../controllers/configTemplateController");

jest.mock("../config/cloudinary", () => ({
  uploader: {
    upload: jest.fn(),
  },
}));

jest.mock("../models/ConfigTemplate");

describe("updateConfigTemplate", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "12345" },
      body: {
        clinicName: "Updated Clinic",
        doctorName: "Updated Doctor",
        mobile: "9876543210",
        headerName: "Updated Header",
        subHeaderName: "Updated Subheader",
        footer: "Updated Footer",
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
    ConfigTemplate.findById = jest.fn().mockResolvedValue({
      _id: "12345",
      clinicName: "Original Clinic",
      doctorName: "Original Doctor",
      mobile: "1234567890",
      headerName: "Original Header",
      subHeaderName: "Original Subheader",
      footer: "Original Footer",
      save: jest.fn().mockResolvedValue(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the config template and return 200 status", async () => {
    await updateConfigTemplate(req, res);

    expect(ConfigTemplate.findById).toHaveBeenCalledWith("12345");
    expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(3);
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith("path/to/logo");
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      "path/to/signature1"
    );
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      "path/to/signature2"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Config template updated successfully",
      configTemplate: expect.objectContaining({
        clinicName: "Updated Clinic",
        doctorName: "Updated Doctor",
        mobile: "9876543210",
        headerName: "Updated Header",
        subHeaderName: "Updated Subheader",
        footer: "Updated Footer",
        logo: "http://cloudinary.com/image.png",
        signature1: "http://cloudinary.com/image.png",
        signature2: "http://cloudinary.com/image.png",
      }),
    });
  });

  it("should return 400 if clinicName is missing", async () => {
    req.body.clinicName = null;

    await updateConfigTemplate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Clinic Name is required",
    });
  });

  it("should return 404 if the config template is not found", async () => {
    ConfigTemplate.findById.mockResolvedValue(null);

    await updateConfigTemplate(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Config template not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    ConfigTemplate.findById.mockRejectedValue(new Error("Database error"));

    await updateConfigTemplate(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });
});

describe("deleteConfigTemplate", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "12345" },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    ConfigTemplate.findByIdAndDelete = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete the config template and return 200 status", async () => {
    ConfigTemplate.findByIdAndDelete.mockResolvedValue({
      _id: "12345",
      clinicName: "Test Clinic",
    });

    await deleteConfigTemplate(req, res);

    expect(ConfigTemplate.findByIdAndDelete).toHaveBeenCalledWith("12345");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Config template deleted successfully",
      configTemplate: expect.objectContaining({
        _id: "12345",
        clinicName: "Test Clinic",
      }),
    });
  });

  it("should return 404 if the config template is not found", async () => {
    ConfigTemplate.findByIdAndDelete.mockResolvedValue(null);

    await deleteConfigTemplate(req, res);

    expect(ConfigTemplate.findByIdAndDelete).toHaveBeenCalledWith("12345");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Config template not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    ConfigTemplate.findByIdAndDelete.mockRejectedValue(
      new Error("Database error")
    );

    await deleteConfigTemplate(req, res);

    expect(ConfigTemplate.findByIdAndDelete).toHaveBeenCalledWith("12345");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });
});
