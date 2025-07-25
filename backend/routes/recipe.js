const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe } = require("../controller/recipe");
const verifyToken = require("../middleware/auth");

// Set up multer storage (in memory or customize as needed)
const storage = multer.memoryStorage(); // or use diskStorage if saving to disk
const upload = multer({ storage: storage });

// Recipe-related routes
router.get("/", getRecipes); // Get all recipes
router.get("/:id", getRecipe); // Get recipe by id
router.post("/", upload.single("file"), verifyToken, addRecipe); // Add recipe
router.put("/:id", upload.single("file"), editRecipe); // Edit recipe
router.delete("/:id", deleteRecipe); // Delete recipe

module.exports = router;
