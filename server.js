const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: "https://n64n6p-3000.csb.app/",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// MongoDB接続設定
const uri =
  "mongodb+srv://todouser:todouser@cluster0.z0i2rug.mongodb.net/todoList?retryWrites=true&w=majority";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("データベース接続成功"))
  .catch((err) => console.log(err));

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Mongoose Schema and Model
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

// API Routes
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
  });

  const savedTodo = await todo.save();
  res.json(savedTodo);
});

app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(todo);
});

app.delete("/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  res.json(todo);
});

// サーバーを起動
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
