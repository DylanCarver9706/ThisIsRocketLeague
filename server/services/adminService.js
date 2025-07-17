const { collections } = require("../database/mongoCollections");
const { updateMongoDocument } = require("../database/middlewares/mongo");

class AdminService {
  // Get all submissions (terms and records) with their status
  async getAllSubmissions() {
    try {
      const terms = await collections.termsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      const records = await collections.recordsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return {
        success: true,
        data: {
          terms,
          records,
        },
        counts: {
          terms: {
            total: terms.length,
            review: terms.filter((t) => t.status === "review").length,
            published: terms.filter((t) => t.status === "published").length,
            rejected: terms.filter((t) => t.status === "rejected").length,
          },
          records: {
            total: records.length,
            review: records.filter((r) => r.status === "review").length,
            published: records.filter((r) => r.status === "published").length,
            rejected: records.filter((r) => r.status === "rejected").length,
          },
        },
      };
    } catch (error) {
      console.error("Service error fetching submissions:", error);
      throw error;
    }
  }

  // Get submissions by status
  async getSubmissionsByStatus(status, type = null) {
    try {
      if (!["rejected", "review", "published"].includes(status)) {
        throw new Error(
          "Invalid status. Must be 'rejected', 'review', or 'published'"
        );
      }

      let data = {};
      let counts = {};

      if (!type || type === "terms") {
        const terms = await collections.termsCollection
          .find({ status })
          .sort({ createdAt: -1 })
          .toArray();
        data.terms = terms;
        counts.terms = terms.length;
      }

      if (!type || type === "records") {
        const records = await collections.recordsCollection
          .find({ status })
          .sort({ createdAt: -1 })
          .toArray();
        data.records = records;
        counts.records = records.length;
      }

      return {
        success: true,
        data,
        counts,
        status,
      };
    } catch (error) {
      console.error("Service error fetching submissions by status:", error);
      throw error;
    }
  }

  // Update submission status
  async updateSubmissionStatus(id, type, status) {
    try {
      console.log(
        `Updating submission - ID: ${id}, Type: ${type}, Status: ${status}`
      );
      if (!id || !type || !status) {
        throw new Error("Missing required fields: id, type, status");
      }

      if (!["terms", "records"].includes(type)) {
        throw new Error("Invalid type. Must be 'terms' or 'records'");
      }

      if (!["rejected", "review", "published"].includes(status)) {
        throw new Error(
          "Invalid status. Must be 'rejected', 'review', or 'published'"
        );
      }

      const collection =
        type === "terms"
          ? collections.termsCollection
          : collections.recordsCollection;

      // Use the updateMongoDocument middleware function
      const updatedDocument = await updateMongoDocument(
        collection,
        id, // Pass the documentId as a string
        { $set: { status } },
        true // Return the updated document
      );

      if (!updatedDocument) {
        throw new Error("Submission not found");
      }

      return {
        success: true,
        data: updatedDocument,
        message: `Submission status updated to ${status}`,
      };
    } catch (error) {
      console.error("Service error updating submission status:", error);
      throw error;
    }
  }

  // Delete submission
  async deleteSubmission(id, type) {
    try {
      if (!["terms", "records"].includes(type)) {
        throw new Error("Invalid type. Must be 'terms' or 'records'");
      }

      const collection =
        type === "terms"
          ? collections.termsCollection
          : collections.recordsCollection;

      // Try to delete with ObjectId first, then with string ID as fallback
      let result;
      try {
        const { ObjectId } = require("mongodb");
        const objectId = new ObjectId(id);
        result = await collection.findOneAndDelete({ _id: objectId });
      } catch (error) {
        // If ObjectId conversion fails, try with string ID
        result = await collection.findOneAndDelete({ _id: id });
      }

      if (!result || !result.value) {
        throw new Error("Submission not found");
      }

      return {
        success: true,
        message: "Submission deleted successfully",
      };
    } catch (error) {
      console.error("Service error deleting submission:", error);
      throw error;
    }
  }

  // Get admin dashboard stats
  async getDashboardStats() {
    try {
      const terms = await collections.termsCollection.find({}).toArray();
      const records = await collections.recordsCollection.find({}).toArray();

      const stats = {
        terms: {
          total: terms.length,
          review: terms.filter((t) => t.status === "review").length,
          published: terms.filter((t) => t.status === "published").length,
          rejected: terms.filter((t) => t.status === "rejected").length,
        },
        records: {
          total: records.length,
          review: records.filter((r) => r.status === "review").length,
          published: records.filter((r) => r.status === "published").length,
          rejected: records.filter((r) => r.status === "rejected").length,
        },
        recent: {
          terms: await collections.termsCollection
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray(),
          records: await collections.recordsCollection
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray(),
        },
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("Service error fetching dashboard stats:", error);
      throw error;
    }
  }
}

module.exports = new AdminService();
