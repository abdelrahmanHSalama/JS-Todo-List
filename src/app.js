import "./styles.css";
import { format } from "date-fns";

class TodoItem {
  constructor(name, description, dueDate, priority, done) {
    this.name = name;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.dueDate.setHours(0, 0, 0, 0);
    this.priority = priority;
    this.done = done;
    this.id = Date.now();
  }
}

const todos = (function () {
  let todosArray = JSON.parse(localStorage.getItem("todos")) || [];

  if (!localStorage.getItem("isFirstVisit")) {
    todosArray.push({
      name: "Add Task",
      description: "Add a Task by Clicking on the Purple Button Above!",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      done: false,
      id: Date.now(),
    });
    localStorage.setItem("todos", JSON.stringify(todosArray));
    localStorage.setItem("isFirstVisit", "true");
  }

  function addTodo(todoItem) {
    todos.todosArray.push(todoItem);
    localStorage.setItem("todos", JSON.stringify(todos.todosArray));
  }

  function listTodos() {
    console.table(todos.todosArray);
  }

  function removeTodo(taskId) {
    const taskPosition = todos.todosArray.findIndex(
      (task) => task.id === taskId
    );
    if (taskPosition !== -1) {
      todos.todosArray.splice(taskPosition, 1);
    } else {
      console.error("Task not found");
    }
    localStorage.setItem("todos", JSON.stringify(todos.todosArray));
  }

  function changeCompletion(item) {
    item.done = !item.done;
    localStorage.setItem("todos", JSON.stringify(todos.todosArray));
  }

  function editItem(taskId, property, value) {
    const taskPosition = todos.todosArray.findIndex(
      (task) => task.id === taskId
    );
    if (taskPosition !== -1) {
      todos.todosArray[taskPosition][property] = value;
    } else {
      console.error("Task not found");
    }
    localStorage.setItem("todos", JSON.stringify(todos.todosArray));
  }

  return {
    todosArray,
    addTodo,
    listTodos,
    removeTodo,
    changeCompletion,
    editItem,
  };
})();

const DOMHandler = (function () {
  function tasksView() {
    let tasksContainer = document.querySelector("#all-tasks");
    tasksContainer.innerHTML = "";

    let array = JSON.parse(localStorage.getItem("todos"));

    array.forEach((task, index) => {
      let taskDone;
      if (task.done) {
        taskDone = "task-done";
      } else {
        taskDone = "";
      }
      let taskHTML = `
      <div class="task">
          <h2 class="${taskDone}">${task.name}</h2>
          <p>${task.description}</p>
          <p>Due Date: ${format(task.dueDate, "dd/MM/yyyy")}</p>
          <div class="priority ${task.priority}-priority">
            <iconify-icon icon="tabler:flag-filled"></iconify-icon> ${
              task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
            }
            Priority
          </div>
        </div>
              `;
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = taskHTML;
      tasksContainer.appendChild(tempDiv);

      tempDiv.addEventListener("click", () => {
        DOMHandler.editTask(task);
      });
    });
  }

  (function initAddBtn() {
    const addTaskButton = document.querySelector("#new-task-btn");
    addTaskButton.addEventListener("click", () => addTask());
  })();

  function editTask(task) {
    let mainContainer = document.querySelector("#tasks-view");
    let body = document.querySelector("#body");

    mainContainer.classList.add("blurred");

    let taskDialogue = `
        <div id="dialog-container">
  <div id="task-dialog">
    <label class="task-dialog-label">
      <span class="task-dialog-title">Title: </span>
      <input
        type="text"
        value="${task.name}"
        id="name-input"
        class="task-dialog-field"
      />
    </label>
    <label class="task-dialog-label">
      <span class="task-dialog-title">Description: </span>
      <input
        type="text"
        value="${task.description}"
        id="description-input"
        class="task-dialog-field"
      />
    </label>
    <label class="task-dialog-label">
      <span class="task-dialog-title">Due Date: </span>
      <input type="date" value="${format(task.dueDate, "yyyy-MM-dd")}"
      id="due-date-input" class="task-dialog-field" />
    </label>
    <label class="task-dialog-label">
      <span class="task-dialog-title">Priority: </span>
      <span class="task-dialog-buttons">
        <button class="task-dialog-button" id="high-priority">High</button>
        <button class="task-dialog-button" id="medium-priority">Medium</button>
        <button class="task-dialog-button" id="low-priority">Low</button>
      </span>
    </label>
    <label class="task-dialog-label">
      <span class="task-dialog-title">Completed: </span>
      <span class="task-dialog-buttons">
        <button class="task-dialog-button" id="done-button">✅</button>
        <button class="task-dialog-button" id="not-done-button">❌</button>
      </span>
    </label>
    <div id="task-dialog-buttombuttons">
      <button class="task-dialog-button" id="delete-button">Delete</button>
      <button class="task-dialog-button" id="finish-button">Finish</button>
      <button class="task-dialog-button" id="cancel-button">Cancel</button>
    </div>
  </div>
</div>
    `;
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = taskDialogue;
    body.appendChild(tempDiv);

    const addTaskButton = document.querySelector("#new-task-btn");
    addTaskButton.disabled = true;

    let selectedPriority = task.priority;
    let highPriorityBtn = document.querySelector("#high-priority");
    let mediumPriorityBtn = document.querySelector("#medium-priority");
    let lowPriorityBtn = document.querySelector("#low-priority");

    if (selectedPriority == "high") {
      highPriorityBtn.classList.add("task-dialog-button-selected");
    } else if (selectedPriority == "medium") {
      mediumPriorityBtn.classList.add("task-dialog-button-selected");
    } else if (selectedPriority == "low") {
      lowPriorityBtn.classList.add("task-dialog-button-selected");
    }

    highPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.add("task-dialog-button-selected");
      mediumPriorityBtn.classList.remove("task-dialog-button-selected");
      lowPriorityBtn.classList.remove("task-dialog-button-selected");
      selectedPriority = "high";
    });

    mediumPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.remove("task-dialog-button-selected");
      mediumPriorityBtn.classList.add("task-dialog-button-selected");
      lowPriorityBtn.classList.remove("task-dialog-button-selected");
      selectedPriority = "medium";
    });

    lowPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.remove("task-dialog-button-selected");
      mediumPriorityBtn.classList.remove("task-dialog-button-selected");
      lowPriorityBtn.classList.add("task-dialog-button-selected");
      selectedPriority = "low";
    });

    let isDone = task.done;
    let doneBtn = document.querySelector("#done-button");
    let notDoneBtn = document.querySelector("#not-done-button");

    doneBtn.addEventListener("click", () => {
      doneBtn.classList.add("task-dialog-button-selected");
      notDoneBtn.classList.remove("task-dialog-button-selected");
      isDone = true;
    });

    notDoneBtn.addEventListener("click", () => {
      doneBtn.classList.remove("task-dialog-button-selected");
      notDoneBtn.classList.add("task-dialog-button-selected");
      isDone = false;
    });

    if (isDone) {
      doneBtn.classList.add("task-dialog-button-selected");
    } else {
      notDoneBtn.classList.add("task-dialog-button-selected");
    }

    let deleteBtn = document.querySelector("#delete-button");
    deleteBtn.addEventListener("click", () => {
      todos.removeTodo(task.id);
      DOMHandler.removeDialogue();
    });

    let finishBtn = document.querySelector("#finish-button");
    let nameInput = document.querySelector("#name-input");
    let descriptionInput = document.querySelector("#description-input");
    let dueDateInput = document.querySelector("#due-date-input");
    finishBtn.addEventListener("click", () => {
      todos.editItem(task.id, "name", nameInput.value);
      todos.editItem(task.id, "description", descriptionInput.value);
      todos.editItem(task.id, "dueDate", dueDateInput.value);
      todos.editItem(task.id, "priority", selectedPriority);
      todos.editItem(task.id, "done", isDone);
      DOMHandler.removeDialogue();
      DOMHandler.tasksView();
    });

    let cancelBtn = document.querySelector("#cancel-button");
    cancelBtn.addEventListener("click", () => {
      DOMHandler.removeDialogue();
    });
  }

  function addTask() {
    let mainContainer = document.querySelector("#tasks-view");
    let body = document.querySelector("#body");

    mainContainer.classList.add("blurred");

    let taskDialogue = `
        <div id="dialog-container">
  <div id="task-dialog">
    <label class="task-dialog-label">
      <span class="task-dialog-title">Title: </span>
      <input
        type="text"
        value=""
        id="name-input"
        class="task-dialog-field"
      />
    </label>
    <label class="task-dialog-label">
      <span class="task-dialog-title">Description: </span>
      <input
        type="text"
        value=""
        id="description-input"
        class="task-dialog-field"
      />
    </label>
    <label class="task-dialog-label">
      <span class="task-dialog-title">Due Date: </span>
      <input type="date" value=""
      id="due-date-input" class="task-dialog-field" />
    </label>
    <label class="task-dialog-label">
      <span class="task-dialog-title">Priority: </span>
      <span class="task-dialog-buttons">
        <button class="task-dialog-button" id="high-priority">High</button>
        <button class="task-dialog-button" id="medium-priority">Medium</button>
        <button class="task-dialog-button" id="low-priority">Low</button>
      </span>
    </label>
    <label class="task-dialog-label">
      <span class="task-dialog-title">Completed: </span>
      <span class="task-dialog-buttons">
        <button class="task-dialog-button" id="done-button">✅</button>
        <button class="task-dialog-button" id="not-done-button">❌</button>
      </span>
    </label>
    <div id="task-dialog-buttombuttons">
      <button class="task-dialog-button" id="finish-button">Finish</button>
      <button class="task-dialog-button" id="cancel-button">Cancel</button>
    </div>
  </div>
</div>
    `;
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = taskDialogue;
    body.appendChild(tempDiv);

    const addTaskButton = document.querySelector("#new-task-btn");
    addTaskButton.disabled = true;

    let selectedPriority, isDone;

    let highPriorityBtn = document.querySelector("#high-priority");
    let mediumPriorityBtn = document.querySelector("#medium-priority");
    let lowPriorityBtn = document.querySelector("#low-priority");

    highPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.add("task-dialog-button-selected");
      mediumPriorityBtn.classList.remove("task-dialog-button-selected");
      lowPriorityBtn.classList.remove("task-dialog-button-selected");
      selectedPriority = "high";
    });

    mediumPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.remove("task-dialog-button-selected");
      mediumPriorityBtn.classList.add("task-dialog-button-selected");
      lowPriorityBtn.classList.remove("task-dialog-button-selected");
      selectedPriority = "medium";
    });

    lowPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.remove("task-dialog-button-selected");
      mediumPriorityBtn.classList.remove("task-dialog-button-selected");
      lowPriorityBtn.classList.add("task-dialog-button-selected");
      selectedPriority = "low";
    });

    let doneBtn = document.querySelector("#done-button");
    let notDoneBtn = document.querySelector("#not-done-button");

    doneBtn.addEventListener("click", () => {
      doneBtn.classList.add("task-dialog-button-selected");
      notDoneBtn.classList.remove("task-dialog-button-selected");
      isDone = true;
    });

    notDoneBtn.addEventListener("click", () => {
      doneBtn.classList.remove("task-dialog-button-selected");
      notDoneBtn.classList.add("task-dialog-button-selected");
      isDone = false;
    });

    let finishBtn = document.querySelector("#finish-button");
    let nameInput = document.querySelector("#name-input");
    let descriptionInput = document.querySelector("#description-input");
    let dueDateInput = document.querySelector("#due-date-input");
    finishBtn.addEventListener("click", () => {
      let newTask = new TodoItem(
        nameInput.value || "New Task",
        descriptionInput.value || "No Description",
        dueDateInput.value || new Date().toISOString().split("T")[0],
        selectedPriority || "medium",
        isDone || false
      );
      todos.addTodo(newTask);
      todos.listTodos();
      DOMHandler.removeDialogue();
      DOMHandler.tasksView();
    });

    let cancelBtn = document.querySelector("#cancel-button");
    cancelBtn.addEventListener("click", () => {
      DOMHandler.removeDialogue();
    });
  }

  function removeDialogue() {
    let mainContainer = document.querySelector("#tasks-view");
    let dialogue = document.querySelector("#dialog-container");

    mainContainer.classList.remove("blurred");
    dialogue.remove();
    DOMHandler.tasksView();

    const addTaskButton = document.querySelector("#new-task-btn");
    addTaskButton.disabled = false;
  }

  return { tasksView, editTask, addTask, removeDialogue };
})();

const initDOM = (function () {
  DOMHandler.tasksView();
})();
