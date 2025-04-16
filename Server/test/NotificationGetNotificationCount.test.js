const { getNotificationCount } = require('../controllers/notificationController');
const PatientNotificationCount = require('../models/notificationCount');

// Mock the PatientNotificationCount model
jest.mock('../models/notificationCount', () => ({
  findOne: jest.fn(),
}));

// Mock request and response objects
const mockRequest = (query) => ({ query });

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getNotificationCount', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should return notification count when user exists', async () => {
    const req = mockRequest({ userId: '12345' });
    const res = mockResponse();

    const mockNotification = { userId: '12345', notificationCount: 10 };
    PatientNotificationCount.findOne.mockResolvedValue(mockNotification);

    await getNotificationCount(req, res);

    expect(PatientNotificationCount.findOne).toHaveBeenCalledWith({
      userId: '12345',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      count: 10,
    });
  });

  test('should return 404 if notification count for the user is not found', async () => {
    const req = mockRequest({ userId: '12345' });
    const res = mockResponse();

    PatientNotificationCount.findOne.mockResolvedValue(null);

    await getNotificationCount(req, res);

    expect(PatientNotificationCount.findOne).toHaveBeenCalledWith({
      userId: '12345',
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Notification count not found for this user',
    });
  });

  test('should handle errors and return 500 status code', async () => {
    const req = mockRequest({ userId: '12345' });
    const res = mockResponse();

    const mockError = new Error('Database error');
    PatientNotificationCount.findOne.mockRejectedValue(mockError);

    await getNotificationCount(req, res);

    expect(PatientNotificationCount.findOne).toHaveBeenCalledWith({
      userId: '12345',
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching notification count',
    });
   
  });

 
});
