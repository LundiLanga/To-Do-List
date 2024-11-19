document.addEventListener("DOMContentLoaded", () => {
  fetchTasks();
});



async function fetchTasks() {
  const res = await fetch(`${process.env.Server_URI}/tasks`);
  const tasks = await res.json();
  tasks.forEach(addTaskToDOM);
}

async function addTask() {
  const taskInput = document.getElementById('taskInput');
  const text = taskInput.value.trim();
  if (!text) return;

  const res = await fetch(`${process.env.Server_URI}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: text }),
  });

  const task = await res.json();
  addTaskToDOM(task.note);
  taskInput.value = '';
}

async function toggleTaskCompletion(id) {
  const taskElement = document.getElementById(id);
  const completed = !taskElement.classList.contains('completed');

  await fetch(`${process.env.Server_URI}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });

  taskElement.classList.toggle('completed');
}

async function deleteTask(id) {
  await fetch(`${process.env.Server_URI}/tasks/${id}`, { method: 'DELETE' });
  document.getElementById(id).remove();
}

async function editTask(id) {
  const taskElement = document.getElementById(id);
  const span = taskElement.querySelector('span');

  // Replace text span with an input field for editing
  const input = document.createElement('input');
  input.type = 'text';
  input.value = span.innerText;
  input.className = 'edit-input';

  // Replace span with the input
  taskElement.replaceChild(input, span);
  input.focus();

  // Save changes on "Enter" key or blur event
  const saveChanges = async () => {
    const text = input.value.trim();
    if (text) {
      await fetch(`${process.env.Server_URI}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text }),
      });

      const updatedSpan = document.createElement('span');
      updatedSpan.innerText = text;
      updatedSpan.onclick = () => toggleTaskCompletion(id);
      taskElement.replaceChild(updatedSpan, input);
    } else {
      // Revert to original text if input is empty
      taskElement.replaceChild(span, input);
    }
  };

  input.addEventListener('blur', saveChanges);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveChanges();
  });
}

function addTaskToDOM(task) {
  const taskList = document.getElementById('taskList');

  const li = document.createElement('li');
  li.id = task._id;
  li.className = task.completed ? 'completed' : '';
  li.innerHTML = `
    <span onclick="toggleTaskCompletion('${task._id}')">${task.title}</span>
    <div class="icon-container">
      <i class="fas fa-pencil-alt edit-icon" onclick="editTask('${task._id}')"></i>
      <button onclick="deleteTask('${task._id}')">x</button>
    </div>
  `;
  taskList.appendChild(li);
}
