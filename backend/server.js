require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Init app
const app = express();

// Connect Database
connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://mantrashoes.com",
  "https://www.mantrashoes.com",
  "https://mantrashoes.vercel.app",
  "https://www.mantrashoes.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reels", require("./routes/reelRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.get("/api/search", require("./controllers/searchController").globalSearch);

// Test route (optional)
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});