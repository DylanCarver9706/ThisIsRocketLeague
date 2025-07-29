const { collections } = require("../database/mongoCollections");
const {
  createMongoDocument,
  updateMongoDocument,
} = require("../database/middlewares/mongo");
const { ObjectId } = require("mongodb");

class TermsService {
  // Get all terms with filtering and pagination (only published)
  async getAllTerms(params = {}) {
    try {
      const {
        category,
        skillLevel,
        sort = "newest",
        limit = 50,
        page = 1,
        search,
        clientId,
      } = params;

      // Build filter object - only show published terms
      const filter = { status: "published" };
      if (category) filter.category = category;
      if (skillLevel) filter.skillLevel = skillLevel;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { definition: { $regex: search, $options: "i" } },
          { exampleUsage: { $regex: search, $options: "i" } },
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

      const [terms, totalCount] = await Promise.all([
        collections.termsCollection
          .find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        collections.termsCollection.countDocuments(filter),
      ]);

      // Add isLiked field to each term if clientId is provided
      const termsWithLikeStatus = terms.map((term) => ({
        ...term,
        isLiked: clientId ? term.likedBy?.includes(clientId) || false : false,
      }));

      return {
        success: true,
        data: termsWithLikeStatus,
        count: totalCount,
        page: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      };
    } catch (error) {
      console.error("Error fetching terms:", error);
      throw error;
    }
  }

  // Get a specific term by ID (only published)
  async getTermById(id) {
    try {
      const term = await collections.termsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });

      if (!term) {
        throw new Error("Term not found");
      }

      return { success: true, data: term };
    } catch (error) {
      console.error("Error fetching term:", error);
      throw error;
    }
  }

  // Get a specific term by slug (only published)
  async getTermBySlug(slug) {
    try {
      // Convert slug back to term name for comparison
      const termName = slug.toLowerCase().replace(/-/g, " ");

      const term = await collections.termsCollection.findOne({
        title: { $regex: new RegExp(`^${termName}$`, "i") },
        status: "published",
      });

      if (!term) {
        throw new Error("Term not found");
      }

      return { success: true, data: term };
    } catch (error) {
      console.error("Error fetching term by slug:", error);
      throw error;
    }
  }

  // Create a new term (defaults to review status)
  async createTerm(termData) {
    try {
      const {
        title,
        definition,
        category,
        exampleUsage,
        skillLevel,
        submittedBy,
      } = termData;

      // Basic validation
      if (!title || !definition || !category || !exampleUsage || !skillLevel) {
        throw new Error("Missing required fields");
      }

      const newTerm = {
        title,
        definition,
        category,
        exampleUsage,
        skillLevel,
        submittedBy: submittedBy || "Anonymous",
        status: "review", // Default to review status
        likeCount: 0,
        likedBy: [],
      };

      // Use the createMongoDocument middleware function
      const savedTerm = await createMongoDocument(
        collections.termsCollection,
        newTerm,
        true // Return the created document
      );

      return {
        success: true,
        data: savedTerm,
        message: "Term submitted successfully and is under review",
      };
    } catch (error) {
      console.error("Error creating term:", error);
      throw error;
    }
  }

  // Like a term (only published terms can be liked)
  async likeTerm(id, clientId) {
    try {
      const term = await collections.termsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });

      if (!term) {
        throw new Error("Term not found");
      }

      // Check if user already liked this term
      if (term.likedBy.includes(clientId)) {
        throw new Error("You have already liked this term");
      }

      // Add like using updateMongoDocument
      const updateData = {
        $push: { likedBy: clientId },
        $inc: { likeCount: 1 },
      };

      await updateMongoDocument(
        collections.termsCollection,
        id,
        updateData,
        false
      );

      return {
        success: true,
        data: { likeCount: term.likeCount + 1 },
        message: "Term liked successfully",
      };
    } catch (error) {
      console.error("Error liking term:", error);
      throw error;
    }
  }

  // Unlike a term (only published terms can be unliked)
  async unlikeTerm(id, clientId) {
    try {
      const term = await collections.termsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });

      if (!term) {
        throw new Error("Term not found");
      }

      // Check if user has liked this term
      if (!term.likedBy.includes(clientId)) {
        throw new Error("You have not liked this term");
      }

      // Remove like using updateMongoDocument
      const updateData = {
        $pull: { likedBy: clientId },
        $inc: { likeCount: -1 },
      };

      await updateMongoDocument(
        collections.termsCollection,
        id,
        updateData,
        false
      );

      return {
        success: true,
        data: { likeCount: term.likeCount - 1 },
        message: "Term unliked successfully",
      };
    } catch (error) {
      console.error("Error unliking term:", error);
      throw error;
    }
  }

  // Get trending terms (only published)
  async getTrendingTerms(limit = 10) {
    try {
      const trendingTerms = await collections.termsCollection
        .find({ status: "published" })
        .sort({ likeCount: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .toArray();

      return {
        success: true,
        data: trendingTerms,
        count: trendingTerms.length,
      };
    } catch (error) {
      console.error("Error fetching trending terms:", error);
      throw error;
    }
  }

  // Get categories (only from published terms)
  async getCategories() {
    try {
      const categories = await collections.termsCollection
        .aggregate([
          { $match: { status: "published" } },
          { $group: { _id: "$category" } },
          { $sort: { _id: 1 } },
        ])
        .toArray();

      const categoryList = categories.map((cat) => cat._id);

      return {
        success: true,
        data: categoryList,
        count: categoryList.length,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}

module.exports = new TermsService();
