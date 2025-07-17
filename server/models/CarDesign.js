const mongoose = require("mongoose");

const carDesignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
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
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
carDesignSchema.index({ status: 1 });
carDesignSchema.index({ likeCount: -1 });
carDesignSchema.index({ createdAt: -1 });

// Virtual for trending score (likes + recency)
carDesignSchema.virtual("trendingScore").get(function () {
  const daysSinceCreation =
    (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return this.likeCount / (daysSinceCreation + 1); // Add 1 to avoid division by zero
});

// Ensure virtuals are serialized
carDesignSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("CarDesign", carDesignSchema);
