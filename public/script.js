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
  const span = taskElement.querySelector('span');
  
  // Replace the text with an input field for editing
  const input = document.createElement('input');
  input.type = 'text';
  input.value = span.innerText;
  input.className = 'edit-input';
  
  // Replace the span with the input field
  taskElement.replaceChild(input, span);
  input.focus();
  
  // Save changes when pressing "Enter" or when focus is lost
  input.addEventListener('blur', async () => {
    await saveEdit(input, id, taskElement);
  });
  
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      await saveEdit(input, id, taskElement);
    }
  });
}

// Helper function to save edited task
async function saveEdit(input, id, taskElement) {
  const text = input.value.trim();
  
  if (text) {
    // Send updated text to the server
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    // Replace input with updated text in a span
    const updatedSpan = document.createElement('span');
    updatedSpan.innerText = text;
    updatedSpan.onclick = () => toggleTaskCompletion(id);
    taskElement.replaceChild(updatedSpan, input);
  } else {
    // If the input is empty, revert to original text
    const originalSpan = document.createElement('span');
    originalSpan.innerText = input.defaultValue; // Keep the original text
    originalSpan.onclick = () => toggleTaskCompletion(id);
    taskElement.replaceChild(originalSpan, input);
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
