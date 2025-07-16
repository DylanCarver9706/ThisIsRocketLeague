const pluginsService = require("../services/pluginsService");

class PluginsController {
  // Get all plugins
  async getAllPlugins(req, res) {
    try {
      const result = await pluginsService.getPlugins();
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching plugins:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch plugins",
      });
    }
  }

  // Get trending plugins
  async getTrendingPlugins(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const result = await pluginsService.getTrendingPlugins(limit);
      res.json(result);
    } catch (error) {
      console.error("Controller error fetching trending plugins:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch trending plugins",
      });
    }
  }

  // Search plugins
  async searchPlugins(req, res) {
    try {
      const { q: query } = req.query;
      const result = await pluginsService.searchPlugins(query);
      res.json(result);
    } catch (error) {
      console.error("Controller error searching plugins:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search plugins",
      });
    }
  }
}

module.exports = new PluginsController();
