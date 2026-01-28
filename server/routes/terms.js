const express = require("express");
const router = express.Router();
const termsController = require("../controllers/termsController");

// Get all terms with optional filtering and sorting
router.get("/", termsController.getAllTerms);

// Get term suggestions for @tag autocomplete
router.get("/suggest", termsController.getTermSuggestions);

// Get trending terms (top by likes)
router.get("/trending/limit", termsController.getTrendingTerms);

// Get a specific term by slug
router.get("/slug/:slug", termsController.getTermBySlug);

// Get a specific term by ID
router.get("/:id", termsController.getTermById);

// Create a new term
router.post("/", termsController.createTerm);

// Bulk create terms
router.post("/bulk", termsController.bulkCreateTerms);

// Like a term
router.post("/:id/like", termsController.likeTerm);

// Unlike a term
router.delete("/:id/like", termsController.unlikeTerm);

module.exports = router;
