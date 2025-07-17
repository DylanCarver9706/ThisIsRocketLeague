const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// Apply admin authentication to all routes
router.use(adminAuth);

// Get admin dashboard stats
router.get("/dashboard", adminController.getDashboardStats);

// Get all submissions
router.get("/submissions", adminController.getAllSubmissions);

// Get submissions by status
router.get("/submissions/:status", adminController.getSubmissionsByStatus);

// Update submission status
router.put("/submissions/status", adminController.updateSubmissionStatus);

// Delete submission
router.delete("/submissions/:type/:id", adminController.deleteSubmission);

module.exports = router;