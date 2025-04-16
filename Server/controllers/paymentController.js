const Superadmin = require("../models/superadmin");

// controllers/paymentController.js
const { Cashfree } = require("cashfree-pg");

const CLIENT_ID = process.env.CASHFREE_APP_ID;
const CLIENT_SECRET = process.env.CASHFREE_SECRET_KEY;
const ENVIRONMENT = Cashfree.Environment.SANDBOX; // Use "PRODUCTION" for live payments

// Set up Cashfree configurations
Cashfree.XClientId = CLIENT_ID;
Cashfree.XClientSecret = CLIENT_SECRET;
Cashfree.XEnvironment = ENVIRONMENT;

// Controller to create payment session
exports.createPaymentSession = async (req, res) => {
  const { order_id, orderAmount, customer_email, customer_phone } = req.body;

  if (!order_id || !orderAmount || !customer_email || !customer_phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const request = {
      order_id,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${order_id}`,
        customer_email,
        customer_phone,
      },
      order_meta: {
        return_url: `${process.env.BASE_URL}/payment-webhook`,
        notify_url: `${process.env.BASE_URL}/payment-webhook`, // Handle webhooks here
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);

    if (response.data && response.data.payment_session_id) {
      return res.status(200).json({
        paymentSessionId: response.data.payment_session_id,
        orderDetails: response.data,
      });
    } else {
      throw new Error("Failed to create payment session");
    }
  } catch (error) {
    console.error("Error while creating payment session:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

// Handle payment success
exports.handlePaymentSuccess = async (req, res) => {
  const { userId, payment_status, subscriptionDuration } = req.body;

  

  try {
    if (payment_status === "SUCCESS") {
      // Find the user by userId (using findOne for a single user)
      const user = await Superadmin.findById( userId );
      


      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentDate = new Date();
      const subscriptionExpiresAt = new Date(
        currentDate.setMonth(currentDate.getMonth() + subscriptionDuration)
      );

      // Update user's payment status and subscription expiration date
      user.paymentStatus = "active";
      user.subscriptionExpiresAt = subscriptionExpiresAt;

      await user.save();

      return res.status(200).json({ message: "Payment updated successfully" });
    } else {
      return res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkPaymentStatus = async (req, res) => {
  try {
    const { id } = req.body; // Retrieve 'id' from the body
    console.log("Received ID:", id);

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await Superadmin.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { paymentStatus, subscriptionExpiresAt } = user;

    if (paymentStatus === "inactive") {
      return res.status(200).json({
        redirectTo: "payment",
        message: "Payment is inactive. Please proceed to payment.",
      });
    }

    const isSubscriptionExpired =
      subscriptionExpiresAt && new Date(subscriptionExpiresAt) < new Date();

    if (paymentStatus === "active" && isSubscriptionExpired) {
      return res.status(200).json({
        redirectTo: "payment",
        message: "Subscription expired. Please renew your subscription.",
      });
    }

    if (paymentStatus === "active" && !isSubscriptionExpired) {
      return res.status(200).json({
        redirectTo: "dashboard",
        message: "Subscription active. Redirecting to dashboard.",
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
