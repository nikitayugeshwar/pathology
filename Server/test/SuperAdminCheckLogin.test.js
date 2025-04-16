const { checkLogin } = require('../controllers/superAdminAuth');
const jwt = require('jsonwebtoken');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('jsonwebtoken');

describe('checkLogin Controller', () => {
  it('should return 401 if no token is provided in cookies', async () => {
    const req = mockRequest({ cookies: {} }); // No token
    const res = mockResponse();
    await checkLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not logged in' });
  });

  it('should return 200 if token is valid', async () => {
    const mockDecoded = { id: 'valid_user_id' };
    jwt.verify.mockReturnValue(mockDecoded);
    const req = mockRequest({ cookies: { token: 'valid_token' } });
    const res = mockResponse();
    await checkLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User already logged in',
      userId: mockDecoded.id,
    });
  });

  it('should return 401 if token is invalid', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
    const req = mockRequest({ cookies: { token: 'invalid_token' } });
    const res = mockResponse();
    await checkLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should return 401 if token is expired', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('Token expired'); });
    const req = mockRequest({ cookies: { token: 'expired_token' } });
    const res = mockResponse();
    await checkLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should return 401 if JWT_SECRET is missing or incorrect', async () => {
    process.env.JWT_SECRET = undefined; // Simulate missing JWT_SECRET
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
    const req = mockRequest({ cookies: { token: 'valid_token' } });
    const res = mockResponse();
    await checkLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should return 401 if token is malformed', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('jwt malformed'); });
    const req = mockRequest({ cookies: { token: 'malformed_token' } });
    const res = mockResponse();
    await checkLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should return 200 with correct userId if token is valid and contains id', async () => {
    const mockDecoded = { id: 'valid_user_id' };
    jwt.verify.mockReturnValue(mockDecoded);
    const req = mockRequest({ cookies: { token: 'valid_token' } });
    const res = mockResponse();
    await checkLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User already logged in',
      userId: mockDecoded.id,
    });
  });
});
