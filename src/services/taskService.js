export function getNextTaskId(tasks) {
  if (!tasks.length) {
    return 1;
  }

  return Math.max(...tasks.map((task) => task.id)) + 1;
}

export function createTask(text, id) {
  return {
    id,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }

    return {
      ...task,
      completed: !task.completed
    };
  });
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function filterTasks(tasks, currentFilter) {
  if (currentFilter === 'active') {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

export function getTaskStats(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.length - completed;

  return {
    total: tasks.length,
    completed,
    active
  };
}

export function isValidTaskText(text) {
  return text.trim() !== '';
}
