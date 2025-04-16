const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { json } = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./config/db");
const notificationRoutes = require("./routes/notificationsRoutes");
const { init, getIo } = require("./socket");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const patientRoutes = require("./routes/patientRoutes");
const configTestRoutes = require("./routes/configTestRoutes");
const { graphqlUploadExpress } = require("graphql-upload"); // ✅ GraphQL Upload Middleware
const configTemplateRoutes = require("./routes/configTemplateRoutes");
const testReportRoutes = require("./routes/testReportRoutes");
const superadminRoutes = require("./routes/superadminRoutes");
const superAdminAuthRoutes = require("./routes/superAdminAuthRoutes");
const testNameRoutes = require("./routes/testNameRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use(cookieParser());

// Enable CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // include PATCH
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Apply GraphQL Upload Middleware *only* for GraphQL requests
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 3 })
);

// ✅ Use Express for REST routes, excluding GraphQL
app.use(json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/superAdminAuth", superAdminAuthRoutes);
app.use("/api", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/", patientRoutes);
app.use("/", configTestRoutes);
app.use("/", configTemplateRoutes);
app.use("/", testReportRoutes);
app.use("/superAdmin", superadminRoutes);
app.use("/", testNameRoutes);

// ✅ Exclude `/upload` from `graphqlUploadExpress`
app.use("/upload", uploadRoutes);

// REST API Routes
app.use("/api/", notificationRoutes);

const server = http.createServer(app);

// Initialize Socket.io
init(server);
const io = getIo();

io.on("connection", (socket) => {
  console.log(
    `Client connected: ${socket.id}, Transport: ${socket.conn.transport.name}`
  );

  socket.conn.on("upgrade", () => {
    console.log(`Transport upgraded to: ${socket.conn.transport.name}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
  });
});

const port = process.env.PORT || 3000;

const typeDefs = require("./GraphQl/schemas");
const resolvers = require("./GraphQl/resolvers");

const startApolloServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  console.log(`🚀 Apollo Server ready at http://localhost:${port}/graphql`);
};

startApolloServer();

server.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
