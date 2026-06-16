document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');

  const listTodo = document.getElementById('list-todo');
  const listProgress = document.getElementById('list-progress');
  const listDone = document.getElementById('list-done');

  // Load data from LocalStorage
  let tasks = JSON.parse(localStorage.getItem('kanban-tasks')) || [];

  function saveAndRender() {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    render();
  }

  function render() {
    // Clear all columns
    listTodo.innerHTML = '';
    listProgress.innerHTML = '';
    listDone.innerHTML = '';

    tasks.forEach(task => {
      const card = createTaskCard(task);

      // Append card to corresponding status channel
      if (task.status === 'todo') listTodo.appendChild(card);
      if (task.status === 'progress') listProgress.appendChild(card);
      if (task.status === 'done') listDone.appendChild(card);
    });
  }

  function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';

    const text = document.createElement('div');
    text.className = 'task-text';
    text.textContent = task.text;
    card.appendChild(text);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'card-actions';

    // Conditional controls based on column status (Mobile friendly)
    if (task.status === 'progress' || task.status === 'done') {
      const backBtn = document.createElement('button');
      backBtn.className = 'action-btn';
      backBtn.textContent = '◀';
      backBtn.addEventListener('click', () => moveTask(task.id, 'back'));
      actionsContainer.appendChild(backBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    actionsContainer.appendChild(deleteBtn);

    if (task.status === 'todo' || task.status === 'progress') {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'action-btn';
      nextBtn.textContent = task.status === 'todo' ? 'Work ▶' : 'Finish ▶';
      nextBtn.addEventListener('click', () => moveTask(task.id, 'next'));
      actionsContainer.appendChild(nextBtn);
    }

    card.appendChild(actionsContainer);
    return card;
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
      id: Date.now().toString(), // Quick unique ID allocation
      text: text,
      status: 'todo'
    });

    taskInput.value = '';
    saveAndRender();
  }

  function moveTask(id, direction) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (direction === 'next') {
      if (task.status === 'todo') task.status = 'progress';
      else if (task.status === 'progress') task.status = 'done';
    } else if (direction === 'back') {
      if (task.status === 'done') task.status = 'progress';
      else if (task.status === 'progress') task.status = 'todo';
    }
    saveAndRender();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
  }

  // Bind Controls
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Run layout painting on boot
  render();
});
