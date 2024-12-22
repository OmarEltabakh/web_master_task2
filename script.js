const inputData = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const tasksContainer = document.querySelector(".tasksContainer");

let arrayOfTasks = JSON.parse(localStorage.getItem("arrayOfTasks")) || [];

// Load existing tasks from localStorage
if (arrayOfTasks.length > 0) {
    addTasksToPage(arrayOfTasks);
}

// Add a task
addTaskButton.addEventListener("click", () => {

    // use trim to remoe space in first or second title
    const taskTitle = inputData.value.trim();
    if (taskTitle) {
        const task = {
            id: Date.now(),
            title: taskTitle,
            completed: false, // Add completed status
        };
        arrayOfTasks.push(task);
        updateLocalStorage();
        addTasksToPage(arrayOfTasks);
        showNotification("Task Added");
        inputData.value = ""; // Clear input
    }
});

// Add tasks to the page
function addTasksToPage(tasks) {
    tasksContainer.innerHTML = ""; // Clear existing tasks

    tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = `task ${task.completed ? "completed" : ""}`;
        taskElement.id = task.id;

        taskElement.innerHTML = `
            <div class="checkboxAndTitleContainer">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <p>${task.title}</p>
            </div>
            <div>
                <button class="update">Update</button>
                <button class="delete">Delete</button>
            </div>
        `;

        tasksContainer.appendChild(taskElement);

        // Add animation
        setTimeout(() => {
            taskElement.classList.add("show");
        }, 10);
    });
}

// Handle task buttons and checkbox clicks
tasksContainer.addEventListener("click", (e) => {
    const taskElement = e.target.closest(".task");

    if (e.target.classList.contains("delete")) {
        // Delete task
        deleteTask(taskElement.id);
    } else if (e.target.classList.contains("update")) {
        // Update task
        const newTitle = prompt("Enter the updated task:", taskElement.querySelector("p").innerText);
        if (newTitle) {
            updateTask(taskElement.id, newTitle);
        }
    } else if (e.target.type === "checkbox") {
        // Toggle completed status
        toggleTaskCompletion(taskElement.id, e.target.checked);
    }
});

// Delete a task
function deleteTask(taskId) {
    arrayOfTasks = arrayOfTasks.filter(task => task.id !== parseInt(taskId));
    updateLocalStorage();
    addTasksToPage(arrayOfTasks);
    showNotification("Task Deleted");
}

// Update a task
function updateTask(taskId, newTitle) {
    arrayOfTasks = arrayOfTasks.map(task =>
        task.id === parseInt(taskId) ? { ...task, title: newTitle } : task
    );
    updateLocalStorage();
    addTasksToPage(arrayOfTasks);
    showNotification("Task Updated");
}

// Toggle task completion
function toggleTaskCompletion(taskId, completed) {
    arrayOfTasks = arrayOfTasks.map(task =>
        task.id === parseInt(taskId) ? { ...task, completed } : task
    );
    updateLocalStorage();
    addTasksToPage(arrayOfTasks);
    showNotification(completed ? "Task Marked as Completed" : "Task Marked as Incomplete");
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem("arrayOfTasks", JSON.stringify(arrayOfTasks));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 10);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
