import './style.css'
import { loadTasks, saveTasks } from './storage/taskStorage.js'
import {
    createTask,
    deleteTask as removeTask,
    filterTasks,
    getNextTaskId,
    getTaskStats,
    isValidTaskText,
    toggleTask as toggleTaskInService
} from './services/taskService.js'

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
    
    renderTasks();
    updateStats();
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
    
    renderTasks();
    updateStats();
}


function renderTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; 

    let filteredTasks = filterTasks(tasks, currentFilter);
    

    for (let i = 0; i < filteredTasks.length; i++) {
        let task = filteredTasks[i];
        let taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        
        if (task.completed) {
            taskDiv.className = 'task-item completed';
        }
        
        taskDiv.innerHTML = 
            `<span>${task.text}</span>
            <div class="task-buttons">
              <button class="complete-btn" data-id="${task.id}">
                ${task.completed ? "Reactivar" : "Completar"}
              </button>
              <button class="delete-btn" data-id="${task.id}">Eliminar</button>
            </div>`;

        let completeBtn = taskDiv.querySelector('.complete-btn');
        let deleteBtn = taskDiv.querySelector('.delete-btn');
        
        completeBtn.onclick = function() {
            toggleTask(parseInt(this.getAttribute('data-id')));
        };
        
        deleteBtn.onclick = function() {
            deleteTask(parseInt(this.getAttribute('data-id')));
        };
        
        taskList.appendChild(taskDiv);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay tareas para mostrar</p>';
    }
}

function toggleTask(id) {
    tasks = toggleTaskInService(tasks, id);
    saveTasks(tasks);
    
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    tasks = removeTask(tasks, id);
    saveTasks(tasks);
    
    renderTasks();
    updateStats();
}

function setCurrentFilter(filter) {
    currentFilter = filter;
    
    let buttons = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    if (filter == 'all') {
        buttons[0].classList.add('active');
    } else if (filter == 'active') {
        buttons[1].classList.add('active');
    } else {
        buttons[2].classList.add('active');
    }
    
    renderTasks();
}

function updateStats() {
    const stats = getTaskStats(tasks);
    
    let statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = 'Total: ' + stats.total + ' | Completadas: ' + stats.completed + ' | Activas: ' + stats.active;
}