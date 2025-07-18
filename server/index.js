const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { initializeCollections } = require("./database/mongoCollections");

const termsRoutes = require("./routes/terms");
const recordsRoutes = require("./routes/records");
const pluginsRoutes = require("./routes/plugins");
const adminRoutes = require("./routes/admin");
const carDesignsRoutes = require("./routes/carDesigns");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Simple request logging - only method and route
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// API routes
console.log("Setting up API routes...");
app.use("/api/terms", termsRoutes);
app.use("/api/records", recordsRoutes);
app.use("/api/plugins", pluginsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/car-designs", carDesignsRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "This is Rocket League!" });
});

console.log("API routes configured");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeCollections();
    console.log("Server Ready");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
 