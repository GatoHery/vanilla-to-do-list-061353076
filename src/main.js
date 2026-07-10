import './style.css'
import { loadTasks, saveTasks } from './storage/taskStorage.js'
import {
    createTask,
    deleteTask as removeTask,
    getNextTaskId,
    isValidTaskText,
    toggleTask as toggleTaskInService
} from './services/taskService.js'
import {
    renderTasks,
    setActiveFilterButton,
    updateStats as updateTaskStats
} from './ui/taskView.js'

let tasks = [];
let currentFilter = 'all';


window.onload = function() {
    tasks = loadTasks();
    
    document.getElementById('addBtn').onclick = addTask;
    
    let filterButtons = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].onclick = function() {
            setCurrentFilter(this.getAttribute('data-filter'));
        };
    }
    
    document.getElementById('taskInput').onkeypress = function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    };
    
    renderTasks(tasks, currentFilter, toggleTask, deleteTask);
    updateTaskStats(tasks);
};

function addTask() {
    let input = document.getElementById('taskInput');
    let text = input.value;
    
    if (!isValidTaskText(text)) {
        alert('Por favor escribe una tarea');
        return;
    }

    const nextTaskId = getNextTaskId(tasks);
    const newTask = createTask(text, nextTaskId);

    tasks.push(newTask);
    saveTasks(tasks);
    
    input.value = '';
    
    renderTasks(tasks, currentFilter, toggleTask, deleteTask);
    updateTaskStats(tasks);
}

function toggleTask(id) {
    tasks = toggleTaskInService(tasks, id);
    saveTasks(tasks);
    
    renderTasks(tasks, currentFilter, toggleTask, deleteTask);
    updateTaskStats(tasks);
}

function deleteTask(id) {
    tasks = removeTask(tasks, id);
    saveTasks(tasks);
    
    renderTasks(tasks, currentFilter, toggleTask, deleteTask);
    updateTaskStats(tasks);
}

function setCurrentFilter(filter) {
    currentFilter = filter;
    setActiveFilterButton(filter);
    renderTasks(tasks, currentFilter, toggleTask, deleteTask);
}