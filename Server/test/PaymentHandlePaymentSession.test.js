const { handlePaymentSuccess } = require('../controllers/paymentController');
const Superadmin = require('../models/superadmin'); // Mocked model

jest.mock('../models/superadmin');

describe('handlePaymentSuccess', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userId: '12345',
        payment_status: 'SUCCESS',
        subscriptionDuration: 6,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should return 400 if required fields are missing', async () => {
    delete req.body.userId;
    await handlePaymentSuccess(req, res);
    // expect(res.status).toHaveBeenCalledWith(400);
    // expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
  });

  test('should return 400 if payment status is not SUCCESS', async () => {
    req.body.payment_status = 'FAILED';
    await handlePaymentSuccess(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Payment not successful' });
  });

  test('should return 404 if user is not found', async () => {
    Superadmin.findById.mockResolvedValue(null);
    await handlePaymentSuccess(req, res);
    expect(Superadmin.findById).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

//   test('should update payment and return 200 if payment is successful', async () => {
//     const mockUser = {
//       save: jest.fn(),
//       paymentStatus: '',
//       subscriptionExpiresAt: null,
//     };
//     Superadmin.findById.mockResolvedValue(mockUser);

//     const currentDate = new Date();
//     const expectedExpiry = new Date(currentDate.setMonth(currentDate.getMonth() + req.body.subscriptionDuration));

//     await handlePaymentSuccess(req, res);

//     expect(Superadmin.findById).toHaveBeenCalledWith('12345');
//     expect(mockUser.paymentStatus).toBe('active');
//     expect(mockUser.subscriptionExpiresAt).toEqual(expectedExpiry);
//     expect(mockUser.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Payment updated successfully' });
//   });

  test('should handle errors during user retrieval gracefully', async () => {
    const mockError = new Error('Database retrieval error');
    Superadmin.findById.mockRejectedValue(mockError);

    await handlePaymentSuccess(req, res);

    expect(Superadmin.findById).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  test('should handle errors during save gracefully', async () => {
    const mockUser = {
      save: jest.fn().mockRejectedValue(new Error('Database save error')),
      paymentStatus: '',
      subscriptionExpiresAt: null,
    };
    Superadmin.findById.mockResolvedValue(mockUser);

    await handlePaymentSuccess(req, res);

    expect(Superadmin.findById).toHaveBeenCalledWith('12345');
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
