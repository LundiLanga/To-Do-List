import express from 'express';
import connectDB from './database.js';
import cors from 'cors';
import Note from './models/note.js';

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Endpoint to get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Note.find(); // Fetch tasks from MongoDB
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// Endpoint to add a new task
app.post('/tasks', async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming request body

  try {
    const { title } = req.body;  // Expect 'title' in the request body

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Create and save the new note in MongoDB
    const newNote = new Note({ title });
    await newNote.save();

    // Send the newly created task as the response
    res.status(201).json({ message: "Successfully added", note: newNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add task" });
  }
});


// Endpoint to update a task (mark as completed)
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, title } = req.body; // Allow both title and completed status to be updated

    const task = await Note.findById(id); // Find task by ID

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update the task with the new data
    task.completed = completed !== undefined ? completed : task.completed;
    task.title = title !== undefined ? title : task.title;

    await task.save(); // Save the updated task

    res.json(task); // Return the updated task
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Endpoint to delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Note.findByIdAndDelete(id); // Delete task by ID

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" }); // Return success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Start the server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
