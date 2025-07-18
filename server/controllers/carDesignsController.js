const carDesignsService = require("../services/carDesignsService");

class CarDesignsController {
  // Get all car designs with filtering and pagination
  async getAllCarDesigns(req, res) {
    try {
      const clientId = req.headers["x-client-id"];
      const params = { ...req.query, clientId };
      const result = await carDesignsService.getAllCarDesigns(params);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching car designs:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch car designs",
      });
    }
  }

  // Get a specific car design by ID
  async getCarDesignById(req, res) {
    try {
      const result = await carDesignsService.getCarDesignById(req.params.id);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching car design:", error);
      if (error.message === "Car design not found") {
        return res.status(404).json({
          success: false,
          error: "Car design not found",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to fetch car design",
      });
    }
  }

  // Create a new car design
  async createCarDesign(req, res) {
    try {
      const result = await carDesignsService.createCarDesign(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Controller error creating car design:", error);
      if (error.message === "Missing required fields") {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }
      if (error.message.includes("Invalid image format")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to create car design",
      });
    }
  }

  // Like a car design
  async likeCarDesign(req, res) {
    try {
      const clientId =
        req.headers["x-client-id"] || req.ip || req.connection.remoteAddress;
      const result = await carDesignsService.likeCarDesign(
        req.params.id,
        clientId
      );
      res.json(result);
    } catch (error) {
      console.error("Controller error liking car design:", error);
      if (error.message === "Car design not found") {
        return res.status(404).json({
          success: false,
          error: "Car design not found",
        });
      }
      if (error.message === "You have already liked this car design") {
        return res.status(400).json({
          success: false,
          error: "You have already liked this car design",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to like car design",
      });
    }
  }

  // Get trending car designs
  async getTrendingCarDesigns(req, res) {
    try {
      const result = await carDesignsService.getTrendingCarDesigns(
        req.query.limit
      );
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching trending car designs:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch trending car designs",
      });
    }
  }
}

module.exports = new CarDesignsController();
