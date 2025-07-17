const adminService = require("../services/adminService");

class AdminController {
  // Get all submissions (terms and records) with their status
  async getAllSubmissions(req, res) {
    try {
      const result = await adminService.getAllSubmissions();
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching submissions:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch submissions",
      });
    }
  }

  // Get submissions by status
  async getSubmissionsByStatus(req, res) {
    try {
      const { status } = req.params;
      const { type } = req.query; // 'terms' or 'records'
      const result = await adminService.getSubmissionsByStatus(status, type);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching submissions by status:", error);
      if (error.message.includes("Invalid status")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to fetch submissions",
      });
    }
  }

  // Update submission status
  async updateSubmissionStatus(req, res) {
    try {
      const { id, type, status } = req.body;
      const result = await adminService.updateSubmissionStatus(
        id,
        type,
        status
      );
      res.json(result);
    } catch (error) {
      console.error("Controller error updating submission status:", error);
      if (
        error.message.includes("Missing required fields") ||
        error.message.includes("Invalid type") ||
        error.message.includes("Invalid status") ||
        error.message.includes("Invalid submission ID format")
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message === "Submission not found") {
        return res.status(404).json({
          success: false,
          error: "Submission not found",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to update submission status",
      });
    }
  }

  // Delete submission
  async deleteSubmission(req, res) {
    try {
      const { id, type } = req.params;
      const result = await adminService.deleteSubmission(id, type);
      res.json(result);
    } catch (error) {
      console.error("Controller error deleting submission:", error);
      if (
        error.message.includes("Invalid type") ||
        error.message.includes("Invalid submission ID format")
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message === "Submission not found") {
        return res.status(404).json({
          success: false,
          error: "Submission not found",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to delete submission",
      });
    }
  }

  // Get admin dashboard stats
  async getDashboardStats(req, res) {
    try {
      const result = await adminService.getDashboardStats();
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching dashboard stats:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch dashboard stats",
      });
    }
  }
}

module.exports = new AdminController();
