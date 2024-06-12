document.addEventListener('DOMContentLoaded', loadTasks);

document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const taskDeadline = document.getElementById('taskDeadline').value;
    if (taskText === '' || taskDeadline === '') return;

    const taskList = document.getElementById('taskList');
    const newTask = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        newTask.classList.toggle('completed', checkbox.checked);
        saveTasks();
    });

    const taskSpan = document.createElement('span');
    taskSpan.innerText = `${taskText} (Deadline: ${new Date(taskDeadline).toLocaleString()})`;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(newTask);
        saveTasks();
    });

    newTask.appendChild(checkbox);
    newTask.appendChild(taskSpan);
    newTask.appendChild(deleteButton);
    taskList.appendChild(newTask);
    taskInput.value = '';
    document.getElementById('taskDeadline').value = '';

    saveTasks();
    checkDeadlines();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(task => {
        tasks.push({
            text: task.querySelector('span').textContent,
            completed: task.classList.contains('completed'),
            deadline: task.querySelector('span').textContent.match(/Deadline: (.+)\)/)[1]
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskData => {
        const taskList = document.getElementById('taskList');
        const newTask = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = taskData.completed;
        checkbox.addEventListener('change', () => {
            newTask.classList.toggle('completed', checkbox.checked);
            saveTasks();
        });

        const taskSpan = document.createElement('span');
        taskSpan.innerText = `${taskData.text} (Deadline: ${new Date(taskData.deadline).toLocaleString()})`;
        if (taskData.completed) {
            newTask.classList.add('completed');
        }

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(newTask);
            saveTasks();
        });

        newTask.appendChild(checkbox);
        newTask.appendChild(taskSpan);
        newTask.appendChild(deleteButton);
        taskList.appendChild(newTask);
    });
    checkDeadlines();
}

function checkDeadlines() {
    const now = new Date().getTime();
    document.querySelectorAll('#taskList li').forEach(task => {
        const deadline = new Date(task.querySelector('span').textContent.match(/Deadline: (.+)\)/)[1]).getTime();
        if (!task.classList.contains('completed') && now > deadline) {
            task.style.backgroundColor = 'yellow';
        }
    });
}

setInterval(checkDeadlines, 60000); // Check deadlines every minute
