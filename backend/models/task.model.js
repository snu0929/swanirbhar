const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    title: { type: String, required: true }, // Task title (required)
    description: { type: String, required: true }, // Task description (required)
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"], // Only allow specific statuses
      default: "pending", // Default status is "pending"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"], // Allow specific priority levels
      default: "medium", // Default priority is "medium"
    },
    dueDate: { type: Date }, // Optional due date
    createdAt: { type: Date, default: Date.now }, // Automatically set created date
    updatedAt: { type: Date, default: Date.now }, // Automatically set updated date
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
      required: true, // Each task must be associated with a user
    },
  },
  { versionKey: false } // Remove the "__v" field
);

const TaskModel = mongoose.model("task", TaskSchema);

module.exports = {
  TaskModel,
};
