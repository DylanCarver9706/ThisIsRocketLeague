const { collections } = require("../database/mongoCollections");
const { ObjectId } = require("mongodb");

class TermsService {
  // Get all terms with filtering and pagination
  async getAllTerms(params = {}) {
    try {
      const {
        category,
        skillLevel,
        sort = "newest",
        limit = 50,
        page = 1,
        search,
      } = params;

      // Build filter object
      const filter = {};
      if (category) filter.category = category;
      if (skillLevel) filter.skillLevel = skillLevel;
      if (search) {
        filter.$or = [
          { term: { $regex: search, $options: "i" } },
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

      return {
        success: true,
        data: terms,
        count: totalCount,
        page: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      };
    } catch (error) {
      console.error("Error fetching terms:", error);
      throw error;
    }
  }

  // Get a specific term by ID
  async getTermById(id) {
    try {
      const term = await collections.termsCollection.findOne({
        _id: new ObjectId(id),
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

  // Create a new term
  async createTerm(termData) {
    try {
      const {
        term,
        definition,
        category,
        exampleUsage,
        skillLevel,
        submittedBy,
      } = termData;

      // Basic validation
      if (!term || !definition || !category || !exampleUsage || !skillLevel) {
        throw new Error("Missing required fields");
      }

      const newTerm = {
        term,
        definition,
        category,
        exampleUsage,
        skillLevel,
        submittedBy: submittedBy || "Anonymous",
        likeCount: 0,
        likedBy: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collections.termsCollection.insertOne(newTerm);
      const savedTerm = await collections.termsCollection.findOne({
        _id: result.insertedId,
      });

      return {
        success: true,
        data: savedTerm,
        message: "Term created successfully",
      };
    } catch (error) {
      console.error("Error creating term:", error);
      throw error;
    }
  }

  // Like a term
  async likeTerm(id, clientId) {
    try {
      const term = await collections.termsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!term) {
        throw new Error("Term not found");
      }

      // Check if user already liked this term
      if (term.likedBy.includes(clientId)) {
        throw new Error("You have already liked this term");
      }

      // Add like
      await collections.termsCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $push: { likedBy: clientId },
          $inc: { likeCount: 1 },
        }
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

  // Get trending terms
  async getTrendingTerms(limit = 10) {
    try {
      const trendingTerms = await collections.termsCollection
        .find()
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

  // Get categories
  async getCategories() {
    try {
      const categories = await collections.termsCollection
        .aggregate([
          { $group: { _id: "$category" } },
          { $sort: { _id: 1 } }
        ])
        .toArray();

      const categoryList = categories.map(cat => cat._id);

      return {
        success: true,
        data: categoryList,
        count: categoryList.length
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}

module.exports = new TermsService();
