const express = require("express");
const router = express.Router();
const pluginsController = require("../controllers/pluginsController");

// Get all plugins
router.get("/", pluginsController.getAllPlugins);

// Get trending plugins
router.get("/trending", pluginsController.getTrendingPlugins);

// Search plugins
router.get("/search", pluginsController.searchPlugins);

module.exports = router;
