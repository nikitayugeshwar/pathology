const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const patientRoutes = require("./routes/patientRoutes");
const testNameRoutes = require("./routes/testNameRoutes");
const configTestRoutes = require("./routes/configTestRoutes");
const configTemplateRoutes = require("./routes/configTemplateRoutes");
const testReportRoutes = require("./routes/testReportRoutes");
const superadminRoutes = require("./routes/superadminRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const superAdminAuthRoutes = require("./routes/superAdminAuthRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();


// Sample data: List of test names
// Expanded list of human body test names





// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Register routes
app.use("/superAdminAuth", superAdminAuthRoutes);
app.use("/api", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/", patientRoutes);
app.use("/", testNameRoutes);
app.use("/", configTestRoutes);
app.use("/", configTemplateRoutes);
app.use("/", testReportRoutes);
app.use("/api/userProfile", userProfileRoutes);
app.use("/superAdmin", superadminRoutes);
app.use("/api", paymentRoutes);

module.exports = app;
