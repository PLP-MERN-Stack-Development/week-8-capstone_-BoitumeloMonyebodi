const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");

// Swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const PORT = process.env.PORT || 3000;

// Connect to the database
connectDb();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ✅ Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Recipe API",
      version: "1.0.0",
      description: "API documentation for your Food Recipe app",
    },
  },
  apis: ["./routes/*.js"], // ✅ Fixed: points to JS files, not just folder
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

