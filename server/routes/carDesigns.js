const express = require("express");
const router = express.Router();
const carDesignsController = require("../controllers/carDesignsController");

// Get all car designs with filtering and pagination
router.get("/", carDesignsController.getAllCarDesigns);

// Get trending car designs
router.get("/trending", carDesignsController.getTrendingCarDesigns);

// Get trending car designs with limit
router.get("/trending/limit", carDesignsController.getTrendingCarDesigns);

// Get a specific car design by ID
router.get("/:id", carDesignsController.getCarDesignById);

// Create a new car design
router.post("/", carDesignsController.createCarDesign);

// Like a car design
router.post("/:id/like", carDesignsController.likeCarDesign);

module.exports = router;
