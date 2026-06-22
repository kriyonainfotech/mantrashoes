require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Init app
const app = express();

// Connect Database
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",   // local dev (Next.js)
  "http://localhost:3001",
  "http://localhost:3002",
  "https://mantrashoes.com",
  "https://www.mantrashoes.com",
  "https://mantrashoes.vercel.app",
  "https://www.mantrashoes.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS Origin checked:", origin);
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("CORS REJECTED origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if using cookies/auth
  })
);

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