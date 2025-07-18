const recordsService = require("../services/recordsService");

class RecordsController {
  // Get all records with filtering and pagination
  async getAllRecords(req, res) {
    try {
      const clientId = req.headers["x-client-id"];
      const params = { ...req.query, clientId };
      const result = await recordsService.getAllRecords(params);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching records:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch records",
      });
    }
  }

  // Get a specific record by ID
  async getRecordById(req, res) {
    try {
      const result = await recordsService.getRecordById(req.params.id);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching record:", error);
      if (error.message === "Record not found") {
        return res.status(404).json({
          success: false,
          error: "Record not found",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to fetch record",
      });
    }
  }

  // Create a new record
  async createRecord(req, res) {
    try {
      const result = await recordsService.createRecord(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Controller error creating record:", error);
      if (error.message === "Missing required fields") {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to create record",
      });
    }
  }

  // Like a record
  async likeRecord(req, res) {
    try {
      const clientId =
        req.headers["x-client-id"] || req.ip || req.connection.remoteAddress;
      const result = await recordsService.likeRecord(req.params.id, clientId);
      res.json(result);
    } catch (error) {
      console.error("Controller error liking record:", error);
      if (error.message === "Record not found") {
        return res.status(404).json({
          success: false,
          error: "Record not found",
        });
      }
      if (error.message === "You have already liked this record") {
        return res.status(400).json({
          success: false,
          error: "You have already liked this record",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to like record",
      });
    }
  }

  // Get trending records
  async getTrendingRecords(req, res) {
    try {
      const result = await recordsService.getTrendingRecords(req.query.limit);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching trending records:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch trending records",
      });
    }
  }

  // Get categories
  async getCategories(req, res) {
    try {
      const result = await recordsService.getCategories();
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching categories:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch categories",
      });
    }
  }
}

module.exports = new RecordsController();
