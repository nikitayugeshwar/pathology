const { resetNotificationCount } = require('../controllers/notificationController');
const PatientNotificationCount = require('../models/notificationCount');

// Mock the PatientNotificationCount model
jest.mock('../models/notificationCount', () => ({
  findOneAndUpdate: jest.fn(),
}));

// Mock request and response objects
const mockRequest = (body) => ({ body });

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('resetNotificationCount', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should reset notification count successfully when user is found', async () => {
    const req = mockRequest({ userId: '12345' });
    const res = mockResponse();

    const mockUser = { userId: '12345', notificationCount: 0 };
    PatientNotificationCount.findOneAndUpdate.mockResolvedValue(mockUser);

    await resetNotificationCount(req, res);

    expect(PatientNotificationCount.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: '12345' },
      { notificationCount: 0 },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Notification count reset successfully',
    });
  });

  test('should return 404 if user is not found', async () => {
    const req = mockRequest({ userId: '12345' });
    const res = mockResponse();

    PatientNotificationCount.findOneAndUpdate.mockResolvedValue(null);

    await resetNotificationCount(req, res);

    expect(PatientNotificationCount.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: '12345' },
      { notificationCount: 0 },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should handle errors and return 500 status code', async () => {
    const req = mockRequest({ userId: '12345' });
    const res = mockResponse();

    const mockError = new Error('Database error');
    PatientNotificationCount.findOneAndUpdate.mockRejectedValue(mockError);

    await resetNotificationCount(req, res);

    expect(PatientNotificationCount.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: '12345' },
      { notificationCount: 0 },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
   
  });

  test('should log the userId from the request body', async () => {
    const req = mockRequest({ userId: '12345' });
    const res = mockResponse();

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    PatientNotificationCount.findOneAndUpdate.mockResolvedValue({
      userId: '12345',
      notificationCount: 0,
    });

    await resetNotificationCount(req, res);

    expect(consoleLogSpy).toHaveBeenCalledWith('user id', '12345');
    consoleLogSpy.mockRestore();
  });

  test('should log the user returned by the database', async () => {
    const req = mockRequest({ userId: '12345' });
    const res = mockResponse();

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const mockUser = { userId: '12345', notificationCount: 0 };

    PatientNotificationCount.findOneAndUpdate.mockResolvedValue(mockUser);

    await resetNotificationCount(req, res);

    expect(consoleLogSpy).toHaveBeenCalledWith('user', mockUser);
    consoleLogSpy.mockRestore();
  });

 
});
