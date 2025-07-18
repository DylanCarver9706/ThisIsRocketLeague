const { collections } = require("../database/mongoCollections");
const {
  createMongoDocument,
  updateMongoDocument,
} = require("../database/middlewares/mongo");
const { ObjectId } = require("mongodb");

class RecordsService {
  // Get all records with filtering and pagination (only published)
  async getAllRecords(params = {}) {
    try {
      const {
        category,
        sort = "newest",
        limit = 50,
        page = 1,
        search,
        clientId,
      } = params;

      // Build filter object - only show published records
      const filter = { status: "published" };
      if (category) filter.category = category;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { recordHolderName: { $regex: search, $options: "i" } },
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
        case "recentAchieved":
          sortObj = { dateAchieved: -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [records, totalCount] = await Promise.all([
        collections.recordsCollection
          .find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        collections.recordsCollection.countDocuments(filter),
      ]);

      // Add isLiked field to each record if clientId is provided
      const recordsWithLikeStatus = records.map((record) => ({
        ...record,
        isLiked: clientId ? record.likedBy?.includes(clientId) || false : false,
      }));

      return {
        success: true,
        data: recordsWithLikeStatus,
        count: totalCount,
        page: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      };
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  }

  // Get a specific record by ID (only published)
  async getRecordById(id) {
    try {
      const record = await collections.recordsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });

      if (!record) {
        throw new Error("Record not found");
      }

      return { success: true, data: record };
    } catch (error) {
      console.error("Error fetching record:", error);
      throw error;
    }
  }

  // Create a new record (defaults to review status)
  async createRecord(recordData) {
    try {
      const {
        title,
        description,
        category,
        recordHolderName,
        proofUrl,
        dateAchieved,
        submittedBy,
      } = recordData;

      // Basic validation
      if (
        !title ||
        !description ||
        !category ||
        !recordHolderName ||
        !proofUrl ||
        !dateAchieved
      ) {
        throw new Error("Missing required fields");
      }

      const newRecord = {
        title,
        description,
        category,
        recordHolderName,
        proofUrl,
        dateAchieved: new Date(dateAchieved),
        submittedBy: submittedBy || "Anonymous",
        status: "review", // Default to review status
        likeCount: 0,
        likedBy: [],
      };

      // Use the createMongoDocument middleware function
      const savedRecord = await createMongoDocument(
        collections.recordsCollection,
        newRecord,
        true // Return the created document
      );

      return {
        success: true,
        data: savedRecord,
        message: "Record submitted successfully and is under review",
      };
    } catch (error) {
      console.error("Error creating record:", error);
      throw error;
    }
  }

  // Like a record (only published records can be liked)
  async likeRecord(id, clientId) {
    try {
      const record = await collections.recordsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });

      if (!record) {
        throw new Error("Record not found");
      }

      // Check if user already liked this record
      if (record.likedBy.includes(clientId)) {
        throw new Error("You have already liked this record");
      }

      // Add like using updateMongoDocument
      const updateData = {
        $push: { likedBy: clientId },
        $inc: { likeCount: 1 },
      };

      await updateMongoDocument(
        collections.recordsCollection,
        id,
        updateData,
        false
      );

      return {
        success: true,
        data: { likeCount: record.likeCount + 1 },
        message: "Record liked successfully",
      };
    } catch (error) {
      console.error("Error liking record:", error);
      throw error;
    }
  }

  // Unlike a record (only published records can be unliked)
  async unlikeRecord(id, clientId) {
    try {
      const record = await collections.recordsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });

      if (!record) {
        throw new Error("Record not found");
      }

      // Check if user has liked this record
      if (!record.likedBy.includes(clientId)) {
        throw new Error("You have not liked this record");
      }

      // Remove like using updateMongoDocument
      const updateData = {
        $pull: { likedBy: clientId },
        $inc: { likeCount: -1 },
      };

      await updateMongoDocument(
        collections.recordsCollection,
        id,
        updateData,
        false
      );

      return {
        success: true,
        data: { likeCount: record.likeCount - 1 },
        message: "Record unliked successfully",
      };
    } catch (error) {
      console.error("Error unliking record:", error);
      throw error;
    }
  }

  // Get trending records (only published)
  async getTrendingRecords(limit = 10) {
    try {
      const trendingRecords = await collections.recordsCollection
        .find({ status: "published" })
        .sort({ likeCount: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .toArray();

      return {
        success: true,
        data: trendingRecords,
        count: trendingRecords.length,
      };
    } catch (error) {
      console.error("Error fetching trending records:", error);
      throw error;
    }
  }

  // Get categories (only from published records)
  async getCategories() {
    try {
      const categories = await collections.recordsCollection
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

module.exports = new RecordsService();
