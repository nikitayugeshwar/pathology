// routes/paymentRoutes.js
const express = require("express");
const paymentController = require("../controllers/paymentController");
const router = express.Router();

router.post("/create-payment", paymentController.createPaymentSession);

router.post("/update-payment", paymentController.handlePaymentSuccess);

router.post("/check-payment-status", paymentController.checkPaymentStatus);

module.exports = router;
