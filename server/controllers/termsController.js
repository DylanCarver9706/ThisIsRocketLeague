const termsService = require("../services/termsService");

class TermsController {
  // Get all terms with filtering and pagination
  async getAllTerms(req, res) {
    try {
      const result = await termsService.getAllTerms(req.query);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching terms:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch terms",
      });
    }
  }

  // Get a specific term by ID
  async getTermById(req, res) {
    try {
      const result = await termsService.getTermById(req.params.id);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching term:", error);
      if (error.message === "Term not found") {
        return res.status(404).json({
          success: false,
          error: "Term not found",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to fetch term",
      });
    }
  }

  // Create a new term
  async createTerm(req, res) {
    try {
      const result = await termsService.createTerm(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Controller error creating term:", error);
      if (error.message === "Missing required fields") {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to create term",
      });
    }
  }

  // Like a term
  async likeTerm(req, res) {
    try {
      const clientId = req.ip || req.connection.remoteAddress;
      const result = await termsService.likeTerm(req.params.id, clientId);
      res.json(result);
    } catch (error) {
      console.error("Controller error liking term:", error);
      if (error.message === "Term not found") {
        return res.status(404).json({
          success: false,
          error: "Term not found",
        });
      }
      if (error.message === "You have already liked this term") {
        return res.status(400).json({
          success: false,
          error: "You have already liked this term",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to like term",
      });
    }
  }

  // Get trending terms
  async getTrendingTerms(req, res) {
    try {
      const result = await termsService.getTrendingTerms(req.query.limit);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching trending terms:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch trending terms",
      });
    }
  }

  // Get categories
  async getCategories(req, res) {
    try {
      const result = await termsService.getCategories();
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

module.exports = new TermsController();
