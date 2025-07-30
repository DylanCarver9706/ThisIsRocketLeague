const mongoose = require("mongoose");

const termSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    definition: {
      type: String,
      required: [true, "Definition is required"],
      trim: true,
      maxlength: [1000, "Definition cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Mechanics", "Slang", "Strategy", "Tactics", "Equipment", "Other"],
      default: "Other",
    },
    exampleUsage: {
      type: String,
      required: [true, "Example usage is required"],
      trim: true,
      maxlength: [500, "Example usage cannot exceed 500 characters"],
    },
    skillLevel: {
      type: String,
      required: [true, "Skill level is required"],
      enum: ["Beginner", "Intermediate", "Pro"],
      default: "Beginner",
    },
    submittedBy: {
      type: String,
      trim: true,
      maxlength: [50, "Submitted by name cannot exceed 50 characters"],
      default: "Anonymous",
    },
    status: {
      type: String,
      enum: ["rejected", "review", "published"],
      default: "review",
    },
    likeCount: {
      type: Number,
      default: 0,
      min: [0, "Like count cannot be negative"],
    },
    likedBy: [
      {
        type: String, // IP addresses or session IDs
        default: [],
      },
    ],
    tags: [
      {
        position: {
          type: Number,
          required: true,
        },
        tagTitle: {
          type: String,
          required: true,
        },
        page: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
termSchema.index({ category: 1, skillLevel: 1 });
termSchema.index({ likeCount: -1 });
termSchema.index({ createdAt: -1 });
termSchema.index({ status: 1 });

// Virtual for trending score (likes + recency)
termSchema.virtual("trendingScore").get(function () {
  const daysSinceCreation =
    (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return this.likeCount / (daysSinceCreation + 1); // Add 1 to avoid division by zero
});

// Ensure virtuals are serialized
termSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Term", termSchema);
