document.addEventListener("DOMContentLoaded", () => {
  fetchTasks();
});

async function fetchTasks() {
  const res = await fetch('/tasks');
  const tasks = await res.json();
  tasks.forEach(addTaskToDOM);
}

async function addTask() {
  const taskInput = document.getElementById('taskInput');
  const text = taskInput.value.trim();
  if (!text) return;

  const res = await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
  });

  const task = await res.json();
  addTaskToDOM(task);
  taskInput.value = '';
}

async function toggleTaskCompletion(id) {
  const taskElement = document.getElementById(id);
  const completed = !taskElement.classList.contains('completed');

  await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
  });

  taskElement.classList.toggle('completed');
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: 'DELETE' });
  document.getElementById(id).remove();
}

async function editTask(id) {
  const taskElement = document.getElementById(id);
  const text = prompt("Edit your task:", taskElement.querySelector('span').innerText);
  
  if (text) {
      await fetch(`/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
      });

      taskElement.querySelector('span').innerText = text;
  }
}

function addTaskToDOM(task) {
  const taskList = document.getElementById('taskList');

  const li = document.createElement('li');
  li.id = task.id;
  li.className = task.completed ? 'completed' : '';
  li.innerHTML = `
  <span onclick="toggleTaskCompletion(${task.id})">${task.text}</span>
  <div class="icon-container">
    <i class="fas fa-pencil-alt edit-icon" onclick="editTask(${task.id})"></i>
    <button onclick="deleteTask(${task.id})">x</button>
  </div>
`;
  taskList.appendChild(li);
}
