const express = require("express");
const router = express.Router();
const recordsController = require("../controllers/recordsController");

// Get all records with optional filtering and sorting
router.get("/", recordsController.getAllRecords);

// Get categories - FIXED: This was missing and causing 404 errors
router.get("/categories/list", recordsController.getCategories);

// Get trending records (top by likes)
router.get("/trending/limit", recordsController.getTrendingRecords);

// Get a specific record by ID
router.get("/:id", recordsController.getRecordById);

// Create a new record
router.post("/", recordsController.createRecord);

// Like a record
router.post("/:id/like", recordsController.likeRecord);

// Unlike a record
router.delete("/:id/like", recordsController.unlikeRecord);

module.exports = router;
