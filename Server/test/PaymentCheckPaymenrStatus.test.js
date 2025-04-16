const { checkPaymentStatus } = require('../controllers/paymentController');
const Superadmin = require('../models/superadmin'); // Mocked model

jest.mock('../models/superadmin');

describe('checkPaymentStatus', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        id: '12345',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should return 400 if user ID is missing', async () => {
    delete req.body.id;
    await checkPaymentStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User ID is required' });
  });

  test('should return 404 if user is not found', async () => {
    Superadmin.findById.mockResolvedValue(null); // Simulating that user is not found
    await checkPaymentStatus(req, res);
    expect(Superadmin.findById).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should return 200 if payment status is inactive', async () => {
    const mockUser = { paymentStatus: 'inactive', subscriptionExpiresAt: null };
    Superadmin.findById.mockResolvedValue(mockUser);

    await checkPaymentStatus(req, res);

    expect(Superadmin.findById).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      redirectTo: 'payment',
      message: 'Payment is inactive. Please proceed to payment.',
    });
  });

  test('should return 200 if payment status is active but subscription is expired', async () => {
    const expiredDate = new Date();
    expiredDate.setMonth(expiredDate.getMonth() - 1); // Past month for expiry
    const mockUser = {
      paymentStatus: 'active',
      subscriptionExpiresAt: expiredDate,
    };
    Superadmin.findById.mockResolvedValue(mockUser);

    await checkPaymentStatus(req, res);

    expect(Superadmin.findById).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      redirectTo: 'payment',
      message: 'Subscription expired. Please renew your subscription.',
    });
  });

  test('should return 200 if payment status is active and subscription is not expired', async () => {
    const validDate = new Date();
    validDate.setMonth(validDate.getMonth() + 1); // Future month for expiry
    const mockUser = {
      paymentStatus: 'active',
      subscriptionExpiresAt: validDate,
    };
    Superadmin.findById.mockResolvedValue(mockUser);

    await checkPaymentStatus(req, res);

    expect(Superadmin.findById).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      redirectTo: 'dashboard',
      message: 'Subscription active. Redirecting to dashboard.',
    });
  });

  test('should handle errors during user retrieval gracefully', async () => {
    const mockError = new Error('Database error');
    Superadmin.findById.mockRejectedValue(mockError);

    await checkPaymentStatus(req, res);

    expect(Superadmin.findById).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error. Please try again later.',
    });
  });
});
