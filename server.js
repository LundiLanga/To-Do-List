const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

let tasks = [];

// Endpoint to get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Endpoint to add a new task
app.post('/tasks', (req, res) => {
  const task = { id: Date.now(), text: req.body.text, completed: false };
  tasks.push(task);
  res.json(task);
});

// Endpoint to update a task (mark as completed)
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (task) {
    task.completed = req.body.completed;
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// Endpoint to delete a task
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
