const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const UserRouter = require("./App/routes/userRouter");
const TaskRouter = require("./App/routes/taskRouter");
require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use("/api/auth", UserRouter);
app.use("/api/task", TaskRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
