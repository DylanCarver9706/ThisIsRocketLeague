const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Fastest Goal",
        "Longest Air Dribble",
        "Highest MMR",
        "Most Goals in Match",
        "Longest Win Streak",
        "Fastest Aerial Goal",
        "Most Saves in Match",
        "Other",
      ],
      default: "Other",
    },
    recordHolderName: {
      type: String,
      required: [true, "Record holder name is required"],
      trim: true,
      maxlength: [100, "Record holder name cannot exceed 100 characters"],
    },
    proofUrl: {
      type: String,
      required: [true, "Proof URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Proof URL must be a valid HTTP/HTTPS URL",
      },
    },
    dateAchieved: {
      type: Date,
      required: [true, "Date achieved is required"],
      max: [Date.now(), "Date achieved cannot be in the future"],
    },
    submittedBy: {
      type: String,
      trim: true,
      maxlength: [50, "Submitted by name cannot exceed 50 characters"],
      default: "Anonymous",
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
recordSchema.index({ category: 1 });
recordSchema.index({ likeCount: -1 });
recordSchema.index({ createdAt: -1 });
recordSchema.index({ dateAchieved: -1 });

// Virtual for trending score (likes + recency)
recordSchema.virtual("trendingScore").get(function () {
  const daysSinceCreation =
    (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return this.likeCount / (daysSinceCreation + 1); // Add 1 to avoid division by zero
});

// Ensure virtuals are serialized
recordSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Record", recordSchema);
