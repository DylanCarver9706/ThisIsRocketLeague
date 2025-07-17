const express = require("express");
const router = express.Router();
const termsController = require("../controllers/termsController");

// Get all terms with optional filtering and sorting
router.get("/", termsController.getAllTerms);

// Get categories - FIXED: This was missing and causing 404 errors
router.get("/categories/list", termsController.getCategories);

// Get trending terms (top by likes)
router.get("/trending/limit", termsController.getTrendingTerms);

// Get a specific term by ID
router.get("/:id", termsController.getTermById);

// Create a new term
router.post("/", termsController.createTerm);

// Like a term
router.post("/:id/like", termsController.likeTerm);

module.exports = router;
 