document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  if (taskForm) {
    const editId = localStorage.getItem("editTaskId");
    let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

    if (editId) {
      const taskToEdit = tasks.find((t) => t.id == editId);
      if (taskToEdit) {
        document.getElementById("taskName").value = taskToEdit.name;
        document.getElementById("taskCategory").value = taskToEdit.category;
        document.getElementById("taskDate").value = taskToEdit.date;

        const saveBtn = taskForm.querySelector(".btn-save");
        if (saveBtn) saveBtn.textContent = "Update Task";
      }
    }

    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const taskName = document.getElementById("taskName").value;
      const taskCategory = document.getElementById("taskCategory").value;
      const taskDate = document.getElementById("taskDate").value;

      if (editId) {
        tasks = tasks.map((task) => {
          if (task.id == editId) {
            return {
              ...task,
              name: taskName,
              category: taskCategory,
              date: taskDate,
            };
          }
          return task;
        });
        localStorage.removeItem("editTaskId");
      } else {
        const newTask = {
          id: Date.now(),
          name: taskName,
          category: taskCategory,
          date: taskDate,
          priority: "Normal",
        };
        tasks.push(newTask);
      }

      localStorage.setItem("myTasks", JSON.stringify(tasks));
      window.location.href = "index.html";
    });

    const cancelBtn =
      document.querySelector(".btn-cancel") ||
      document.querySelector(".btn-back");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        localStorage.removeItem("editTaskId");
      });
    }
  }

  const tableBody = document.getElementById("tasksTableBody");
  if (tableBody) {
    displayTasks();
  }
});

function displayTasks() {
  const tableBody = document.getElementById("tasksTableBody");
  let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

  tableBody.innerHTML = "";

  if (tasks.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #64748b;">No tasks found. Click "+ Add Task" to create one.</td></tr>`;
    return;
  }

  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${task.name}</td>
            <td><span class="badge">${task.category}</span></td>
            <td>${task.date}</td>
            <td>${task.priority || "Normal"}</td>
            <td>
                <button onclick="editTask(${task.id})" class="btn-update">Update</button>
                <button onclick="deleteTask(${task.id})" class="btn-delete">Delete</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

function editTask(id) {
  localStorage.setItem("editTaskId", id);
  window.location.href = "addTask.html";
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("myTasks", JSON.stringify(tasks));
  renderTasks();
}
