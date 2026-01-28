const termsService = require("../services/termsService");

class TermsController {
  // Get all terms with filtering and pagination
  async getAllTerms(req, res) {
    try {
      const clientId = req.headers["x-client-id"];
      const params = { ...req.query, clientId };
      const result = await termsService.getAllTerms(params);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching terms:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch terms",
      });
    }
  }

  // Get term suggestions for @tag autocomplete
  async getTermSuggestions(req, res) {
    try {
      const { q, limit } = req.query;
      const result = await termsService.getTermSuggestions({ q, limit });
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching term suggestions:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch term suggestions",
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

  // Get a specific term by slug
  async getTermBySlug(req, res) {
    try {
      const result = await termsService.getTermBySlug(req.params.slug);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching term by slug:", error);
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

  // Bulk create terms
  async bulkCreateTerms(req, res) {
    try {
      const { terms } = req.body;

      if (!Array.isArray(terms)) {
        return res.status(400).json({
          success: false,
          error: "Terms must be an array",
        });
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        try {
          console.log(`Creating term ${i + 1}/${terms.length}: ${term.title}`);
          const result = await termsService.createTerm(term);
          results.push({
            index: i,
            title: term.title,
            success: true,
            data: result.data,
          });
        } catch (error) {
          console.error(
            `✗ Failed to create term ${i + 1}/${terms.length}: ${term.title}`,
            error.message
          );
          errors.push({
            index: i,
            title: term.title,
            success: false,
            error: error.message,
          });
        }
      }

      res.status(201).json({
        success: true,
        message: `Bulk creation completed. ${results.length} successful, ${errors.length} failed.`,
        results,
        errors,
        summary: {
          total: terms.length,
          successful: results.length,
          failed: errors.length,
        },
      });
    } catch (error) {
      console.error("Controller error in bulk creating terms:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process bulk term creation",
      });
    }
  }

  // Like a term
  async likeTerm(req, res) {
    try {
      const clientId =
        req.headers["x-client-id"] || req.ip || req.connection.remoteAddress;
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

  // Unlike a term
  async unlikeTerm(req, res) {
    try {
      const clientId =
        req.headers["x-client-id"] || req.ip || req.connection.remoteAddress;
      const result = await termsService.unlikeTerm(req.params.id, clientId);
      res.json(result);
    } catch (error) {
      console.error("Controller error unliking term:", error);
      if (error.message === "Term not found") {
        return res.status(404).json({
          success: false,
          error: "Term not found",
        });
      }
      if (error.message === "You have not liked this term") {
        return res.status(400).json({
          success: false,
          error: "You have not liked this term",
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to unlike term",
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
}

module.exports = new TermsController();
