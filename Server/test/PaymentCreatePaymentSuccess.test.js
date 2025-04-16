const { createPaymentSession } = require('../controllers/paymentController');
const Cashfree = require('cashfree-sdk');

jest.mock('cashfree-sdk');

describe('createPaymentSession', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        order_id: '12345',
        orderAmount: 1000,
        customer_email: 'test@example.com',
        customer_phone: '1234567890',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should return 400 if required fields are missing', async () => {
    delete req.body.order_id;
    await createPaymentSession(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

//   test('should return 200 and payment session details on success', async () => {
//     const mockResponse = {
//       data: {
//         payment_session_id: 'session_123',
//         other_details: 'details',
//       },
//     };
//     // Cashfree.PGCreateOrder.mockResolvedValue(mockResponse);

//     await createPaymentSession(req, res);

//     expect(Cashfree.PGCreateOrder).toHaveBeenCalledWith('2023-08-01', {
//       order_id: '12345',
//       order_amount: 1000,
//       order_currency: 'INR',
//       customer_details: {
//         customer_id: 'cust_12345',
//         customer_email: 'test@example.com',
//         customer_phone: '1234567890',
//       },
//       order_meta: {
//         return_url: expect.stringContaining('/payment-webhook'),
//         notify_url: expect.stringContaining('/payment-webhook'),
//       },
//     });
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       paymentSessionId: 'session_123',
//       orderDetails: mockResponse.data,
//     });
//   });

//   test('should return 500 if Cashfree API fails', async () => {
//     const mockResponse = { data: {} }; // No payment_session_id in response
//     Cashfree.PGCreateOrder.mockResolvedValue(mockResponse);

//     await createPaymentSession(req, res);

//     expect(Cashfree.PGCreateOrder).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({
//       error: 'Failed to create payment session',
//     });
//   });

  
});
