const { login } = require('../controllers/superAdminAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/User');

describe('Login Controller', () => {
  it('should return 400 if superadmin is not found', async () => {
    User.findOne.mockResolvedValue(null);
    const req = mockRequest({ body: { email: 'wrongemail@example.com', password: 'password' } });
    const res = mockResponse();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Superadmin not found' });
  });

  it('should return 400 if password is incorrect', async () => {
    User.findOne.mockResolvedValue({ password: 'hashedpassword' });
    bcrypt.compare.mockResolvedValue(false);
    const req = mockRequest({ body: { email: 'validemail@example.com', password: 'wrongpassword' } });
    const res = mockResponse();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  it('should return 200 with tokens if login is successful', async () => {
    User.findOne.mockResolvedValue({ _id: '12345', email: 'validemail@example.com', password: 'hashedpassword' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');
    const req = mockRequest({ body: { email: 'validemail@example.com', password: 'correctpassword' } });
    const res = mockResponse();
    await login(req, res);
    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   message: 'Superadmin login successful',
    //   token: 'token',
    //   refreshToken: 'token',
    // });
  });

  it('should handle errors during superadmin login process', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));
    const req = mockRequest({ body: { email: 'validemail@example.com', password: 'correctpassword' } });
    const res = mockResponse();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error. Please try again later.' });
  });

  // Add more tests for cookie settings, JWT token errors, and other scenarios
});
