const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const clearCompleted = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "todas";


/* SALVAR TAREFAS */

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


/* ATUALIZAR CONTADORES */

function updateCounters() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}


/* FORMATAR DATA */

function formatDate(date) {

    if (!date) {
        return "";
    }

    const parts = date.split("-");

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


/* PEGAR TAREFAS FILTRADAS */

function getFilteredTasks() {

    if (currentFilter === "pendentes") {

        return tasks.filter(function(task) {
            return !task.completed;
        });

    }

    if (currentFilter === "concluidas") {

        return tasks.filter(function(task) {
            return task.completed;
        });

    }

    return tasks;
}


/* MOSTRAR TAREFAS */

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";
    }


    filteredTasks.forEach(function(task) {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        if (task.completed) {
            taskElement.classList.add("completed");
        }


        let dateHTML = "";

        if (task.date) {

            dateHTML = `
                <span class="tag">
                    Entrega: ${formatDate(task.date)}
                </span>
            `;

        }


        let priorityClass = "";

        if (task.priority === "Alta") {
            priorityClass = "priority-alta";
        }

        if (task.priority === "Média") {
            priorityClass = "priority-media";
        }

        if (task.priority === "Baixa") {
            priorityClass = "priority-baixa";
        }


        taskElement.innerHTML = `

            <button 
                class="check-button"
                onclick="toggleTask(${task.id})"
                title="Concluir tarefa">
            </button>

            <div class="task-info">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-details">

                    <span class="tag">
                        ${task.subject}
                    </span>

                    <span class="tag ${priorityClass}">
                        Prioridade: ${task.priority}
                    </span>

                    ${dateHTML}

                </div>

            </div>

            <button
                class="delete-button"
                onclick="deleteTask(${task.id})">
                Excluir
            </button>

        `;


        taskList.appendChild(taskElement);

    });


    updateCounters();
}


/* ADICIONAR TAREFA */

function addTask(title, subject, priority, date) {

    const newTask = {

        id: Date.now(),

        title: title,

        subject: subject,

        priority: priority,

        date: date,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();
}


/* CONCLUIR TAREFA */

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();
}


/* EXCLUIR TAREFA */

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();
}


/* ENVIO DO FORMULÁRIO */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title = taskInput.value.trim();

    const subject = subjectInput.value;

    const priority = priorityInput.value;

    const date = dateInput.value;


    if (title === "") {

        alert("Digite o nome da tarefa.");

        return;
    }


    if (subject === "") {

        alert("Escolha uma matéria.");

        return;
    }


    addTask(
        title,
        subject,
        priority,
        date
    );


    taskForm.reset();

    priorityInput.value = "Média";

});


/* FILTROS */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter = button.dataset.filter;


        renderTasks();

    });

});


/* LIMPAR TAREFAS CONCLUÍDAS */

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {

        return !task.completed;

    });


    saveTasks();

    renderTasks();

});


/* INICIAR SITE */

renderTasks();