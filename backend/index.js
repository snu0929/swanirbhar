const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { taskRouter } = require("./routes/task.routes");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4500;
app.use(cors());
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log("Error connecting to DB:", error);
  }
});
