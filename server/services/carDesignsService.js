const { collections } = require("../database/mongoCollections");
const {
  createMongoDocument,
  updateMongoDocument,
} = require("../database/middlewares/mongo");

class CarDesignsService {
  // Get all car designs with filtering and pagination (only published)
  async getAllCarDesigns(params = {}) {
    try {
      const {
        sort = "newest",
        limit = 50,
        page = 1,
        search,
        clientId,
      } = params;

      // Build filter object - only show published car designs
      const filter = { status: "published" };
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Build sort object
      let sortObj = {};
      switch (sort) {
        case "trending":
          sortObj = { likeCount: -1, createdAt: -1 };
          break;
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "oldest":
          sortObj = { createdAt: 1 };
          break;
        case "mostLiked":
          sortObj = { likeCount: -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [carDesigns, totalCount] = await Promise.all([
        collections.carDesignsCollection
          .find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        collections.carDesignsCollection.countDocuments(filter),
      ]);

      // Add isLiked field to each car design if clientId is provided
      const carDesignsWithLikeStatus = carDesigns.map((carDesign) => ({
        ...carDesign,
        isLiked: clientId
          ? carDesign.likedBy?.includes(clientId) || false
          : false,
      }));

      return {
        success: true,
        data: carDesignsWithLikeStatus,
        count: totalCount,
        page: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      };
    } catch (error) {
      console.error("Error fetching car designs:", error);
      throw error;
    }
  }

  // Get a specific car design by ID (only published)
  async getCarDesignById(id) {
    try {
      const { ObjectId } = require("mongodb");
      const carDesign = await collections.carDesignsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });

      if (!carDesign) {
        throw new Error("Car design not found");
      }

      return { success: true, data: carDesign };
    } catch (error) {
      console.error("Error fetching car design:", error);
      throw error;
    }
  }

  // Create a new car design (defaults to review status)
  async createCarDesign(carDesignData) {
    try {
      const { title, description, image, submittedBy } = carDesignData;

      // Basic validation
      if (!title || !description || !image) {
        throw new Error("Missing required fields");
      }

      // Validate image format (should be base64)
      if (!image.startsWith("data:image/")) {
        throw new Error("Invalid image format. Please upload a valid image.");
      }

      const newCarDesign = {
        title,
        description,
        image,
        submittedBy: submittedBy || "Anonymous",
        status: "review", // Default to review status
        likeCount: 0,
        likedBy: [],
      };

      // Use the createMongoDocument middleware function
      const savedCarDesign = await createMongoDocument(
        collections.carDesignsCollection,
        newCarDesign,
        true // Return the created document
      );

      return {
        success: true,
        data: savedCarDesign,
        message: "Car design submitted successfully and is under review",
      };
    } catch (error) {
      console.error("Error creating car design:", error);
      throw error;
    }
  }

  // Like a car design (only published car designs can be liked)
  async likeCarDesign(id, clientId) {
    try {
      const { ObjectId } = require("mongodb");
      const carDesign = await collections.carDesignsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });

      if (!carDesign) {
        throw new Error("Car design not found");
      }

      // Check if user already liked this car design
      if (carDesign.likedBy.includes(clientId)) {
        throw new Error("You have already liked this car design");
      }

      // Add like using updateMongoDocument middleware
      await updateMongoDocument(
        collections.carDesignsCollection,
        id,
        {
          $push: { likedBy: clientId },
          $inc: { likeCount: 1 },
        },
        false
      );

      return {
        success: true,
        data: { likeCount: carDesign.likeCount + 1 },
        message: "Car design liked successfully",
      };
    } catch (error) {
      console.error("Error liking car design:", error);
      throw error;
    }
  }

  // Get trending car designs (only published)
  async getTrendingCarDesigns(limit = 10) {
    try {
      const trendingCarDesigns = await collections.carDesignsCollection
        .find({ status: "published" })
        .sort({ likeCount: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .toArray();

      return {
        success: true,
        data: trendingCarDesigns,
        count: trendingCarDesigns.length,
      };
    } catch (error) {
      console.error("Error fetching trending car designs:", error);
      throw error;
    }
  }
}

module.exports = new CarDesignsService();
