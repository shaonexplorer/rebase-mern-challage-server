import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rebase-mern-challage-client.vercel.app",
    ], // No trailing slash
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  }),
);

//

// INTENTIONAL ERROR: Missing 'await' in the database connection or incorrect URI handling
await mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "server is running ..." });
});

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
    // res.json({ message: "welcome to the todos api" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// INTENTIONAL ERROR: Incorrect parameter name used in the query
app.post("/api/todos", async (req, res) => {
  const todo = new Todo({
    title: req.body.title, // ERROR Fixed: Frontend sends 'title', not 'task'
    completed: false,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
