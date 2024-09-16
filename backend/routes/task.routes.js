const express = require("express");
const taskRouter = express.Router();
const { TaskModel } = require("../models/task.model"); // Assuming you have TaskModel in models folder
const { authMiddleware } = require("../middleware/auth.middleware");
const { getTaskPrioritySuggestions } = require("../services/aiService");

// Create a new task
taskRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Create a new task using TaskModel
    const newTask = new TaskModel({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.user.userId, // Assuming the token contains the user's ID
    });

    // Save the task to the database
    await newTask.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task", error });
  }
});

// Fetch all tasks for the authenticated user
taskRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await TaskModel.find({ userId: req.user.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
});

// Fetch a specific task by ID
taskRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await TaskModel.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task", error });
  }
});

// Update a specific task by ID
taskRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, status, priority, dueDate, updatedAt: Date.now() },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task", error });
  }
});

// Delete a specific task by ID
taskRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await TaskModel.deleteOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task", error });
  }
});

taskRouter.use(authMiddleware);

taskRouter.post("/ai-suggestions", async (req, res) => {
  try {
    const { tasks } = req.body;

    // Debugging: Check the received body
    console.log("Received body:", req.body);

    // Validate that tasks is an array
    if (!Array.isArray(tasks)) {
      return res
        .status(400)
        .json({ message: "Invalid input, tasks should be an array" });
    }

    // Construct the prompt from tasks
    const prompt = `Here are my tasks: ${tasks.join(
      ", "
    )}. Please prioritize them.`;

    // Replace this function with your actual AI integration
    const result = await getTaskPrioritySuggestions(prompt);

    res.json(result);
  } catch (error) {
    console.error("Error with AI API:", error);
    res.status(500).json({ message: "Error getting AI suggestions" });
  }
});

module.exports = {
  taskRouter,
};
