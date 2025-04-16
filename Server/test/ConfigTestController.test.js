const {
  addFieldsToTest,
  updateFieldsByTestId,
  getFieldsByTestId,
} = require("../controllers/configTestAddFeildController");
const CreateTestReport = require("../models/CreateTestReport");
const httpMocks = require("node-mocks-http");

jest.mock("../models/CreateTestReport");

describe("Test Report Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addFieldsToTest", () => {
    it("should return 400 if fields are missing", async () => {
      const req = httpMocks.createRequest({
        params: { testId: "123" },
        body: {},
      });
      const res = httpMocks.createResponse();

      await addFieldsToTest(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Fields are required" });
    });

    it("should create a new test report if none exists", async () => {
      const req = httpMocks.createRequest({
        params: { testId: "123" },
        body: { fields: ["field1", "field2"], userId: "user1" },
      });
      const res = httpMocks.createResponse();

      CreateTestReport.findOne.mockResolvedValue(null);
      CreateTestReport.prototype.save = jest.fn().mockResolvedValue();

      await addFieldsToTest(req, res);

      expect(CreateTestReport).toHaveBeenCalledWith({
        testId: "123",
        userId: "user1",
        fields: ["field1", "field2"],
      });
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({
        message: "Fields added successfully",
      });
    });
  });

  describe("updateFieldsByTestId", () => {
    it("should return 400 if fields are missing", async () => {
      const req = httpMocks.createRequest({
        params: { testId: "123" },
        body: {},
      });
      const res = httpMocks.createResponse();

      await updateFieldsByTestId(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Fields are required" });
    });

    it("should update fields if the test report exists", async () => {
      const req = httpMocks.createRequest({
        params: { testId: "123" },
        body: { fields: ["updatedField"] },
      });
      const res = httpMocks.createResponse();

      const mockUpdatedTestReport = { testId: "123", fields: ["updatedField"] };
      CreateTestReport.findOneAndUpdate.mockResolvedValue(
        mockUpdatedTestReport
      );

      await updateFieldsByTestId(req, res);

      expect(CreateTestReport.findOneAndUpdate).toHaveBeenCalledWith(
        { testId: "123" },
        { fields: ["updatedField"] },
        { new: true }
      );
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: "Fields updated successfully",
        updatedTestReport: mockUpdatedTestReport,
      });
    });

    it("should return 404 if the test report does not exist", async () => {
      const req = httpMocks.createRequest({
        params: { testId: "123" },
        body: { fields: ["updatedField"] },
      });
      const res = httpMocks.createResponse();

      CreateTestReport.findOneAndUpdate.mockResolvedValue(null);

      await updateFieldsByTestId(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Test report not found" });
    });
  });

  describe("getFieldsByTestId", () => {
    it("should return 404 if the test report is not found", async () => {
      const req = httpMocks.createRequest({
        params: { testId: "123" },
      });
      const res = httpMocks.createResponse();

      CreateTestReport.findOne.mockResolvedValue(null);

      await getFieldsByTestId(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({
        message: "Test report fields not found",
      });
    });

    it("should return 200 with the test report fields if found", async () => {
      const req = httpMocks.createRequest({
        params: { testId: "123" },
      });
      const res = httpMocks.createResponse();

      const mockTestReport = { testId: "123", fields: ["field1"] };
      CreateTestReport.findOne.mockResolvedValue(mockTestReport);

      await getFieldsByTestId(req, res);

      expect(CreateTestReport.findOne).toHaveBeenCalledWith({ testId: "123" });
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: "Test report fields retrieved successfully",
        testReport: mockTestReport,
      });
    });
  });
});
