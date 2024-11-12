document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
  });
  
  async function fetchTasks() {
    const res = await fetch('/tasks');
    const tasks = await res.json();
    tasks.forEach(addTaskToDOM);
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
  