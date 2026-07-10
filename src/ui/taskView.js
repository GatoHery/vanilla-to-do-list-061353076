export function renderTasks(tasks, currentFilter, onToggleTask, onDeleteTask) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  const filteredTasks = getFilteredTasks(tasks, currentFilter);

  for (let i = 0; i < filteredTasks.length; i++) {
    const task = filteredTasks[i];
    const taskDiv = document.createElement('div');
    taskDiv.className = task.completed ? 'task-item completed' : 'task-item';

    taskDiv.innerHTML = `
      <span>${task.text}</span>
      <div class="task-buttons">
        <button class="complete-btn" data-id="${task.id}">
          ${task.completed ? 'Reactivar' : 'Completar'}
        </button>
        <button class="delete-btn" data-id="${task.id}">Eliminar</button>
      </div>`;

    const completeBtn = taskDiv.querySelector('.complete-btn');
    const deleteBtn = taskDiv.querySelector('.delete-btn');

    completeBtn.onclick = function () {
      onToggleTask(parseInt(this.getAttribute('data-id')));
    };

    deleteBtn.onclick = function () {
      onDeleteTask(parseInt(this.getAttribute('data-id')));
    };

    taskList.appendChild(taskDiv);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay tareas para mostrar</p>';
  }
}

export function updateStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;

  const statsDiv = document.getElementById('stats');
  statsDiv.innerHTML = 'Total: ' + total + ' | Completadas: ' + completed + ' | Activas: ' + active;
}

export function setActiveFilterButton(filter) {
  const buttons = document.querySelectorAll('.filter-btn');

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }

  if (filter === 'all') {
    buttons[0].classList.add('active');
  } else if (filter === 'active') {
    buttons[1].classList.add('active');
  } else {
    buttons[2].classList.add('active');
  }
}

function getFilteredTasks(tasks, currentFilter) {
  if (currentFilter === 'active') {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}
