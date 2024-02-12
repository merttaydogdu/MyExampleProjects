'use strict';
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const btnAddTask = document.getElementById("btn-add-task");
const btnClearAll = document.getElementById('btn-clear-all');
const filters = document.querySelectorAll("#filters span");

let isEditMode = false;
let editedTaskId;
let filterMode = "all";


function getTasks() {
    let tasks = [];
    if (localStorage.getItem("TaskList") !== null) {
        tasks = JSON.parse(localStorage.getItem("TaskList"));
    }
    return tasks;
}
let taskListArray = getTasks();

function setTasks() {
    localStorage.setItem("TaskList", JSON.stringify(taskListArray));
}



btnAddTask.addEventListener("click", addTask);

function addTask(e) {
    e.preventDefault();

    const value = taskInput.value.trim();
    if (value == '') {
        alert("Lütfen görev adını boş bırakmayınız...");
    } else {
        if (isEditMode) {//kayıt güncelleme bölümü
            for (const task of taskListArray) {
                if (task.id == editedTaskId) {
                    task.taskName = taskInput.value;
                    isEditMode = false;
                    btnAddTask.innerText = "Ekle";
                    btnAddTask.classList.remove("btn-warning");
                    btnAddTask.classList.add("btn-dark");
                    setTasks();
                    break;
                }
            }
        } else {//burası yeni kayıt bölümü
            const id = taskListArray.length>0 ? taskListArray[taskListArray.length - 1].id + 1 : 1;
            const newTask = { 'id': id, 'taskName': value };
            taskListArray.push(newTask);
            setTasks();
        }
        taskInput.value = "";
        taskInput.focus();
        displayTasks(filterMode);

    }
}

btnClearAll.addEventListener("click", clearAll);

function clearAll() {
    let answer = confirm('Tüm görevler silinecektir!');
    if (answer) {
        taskListArray = [];
        setTasks();
        displayTasks(filterMode);
    }
}

for (const span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        filterMode = span.id;
        displayTasks(filterMode);
    });
}

function displayTasks(filterMode) {
    taskList.innerHTML = "";
    let liElement;
    if(taskListArray.length==0){
        const alert = `
            <div class="alert alert-warning mb-0 ">
            Hiç görev bulunamamıştır.
            </div>   
        `;
        taskList.insertAdjacentHTML("beforeend", alert);
    }else{
        for (const task of taskListArray) {
            const completed = task.completed ? "completed" : "pending";
            if (completed == filterMode || filterMode == "all") {
                liElement = `
        <li class="list-group-item task d-flex">
                        <div class="form-check" align-items-center d-flex gap-1>
                            <input onclick="uptadeStatus(${task.id});" class="form-check-input" type="checkbox" value="" id="${task.id}" ${task.completed ? 'checked' : ''} >
                            <label class="form-check-label ${task.completed ? 'text-decoration-line-through' : ''}" for="${task.id}">
                                ${task.taskName}
                            </label>
                        </div>
                        <div class="btn-group ms-auto" role="group" aria-label="Basic example">
                        <button onclick="editTask(${task.id}, '${task.taskName}')" type="button" class="btn btn-warning">Düzenle</button>
                        <button onclick = "deleteTask(${task.id});" type="button" class="btn btn-danger">Sil</button>
                        </div>
        </li>
        `;
                taskList.insertAdjacentHTML("beforeend", liElement);
            }

        }
    }
    
}

function deleteTask(id) {
    let deletedIndex;
    for (const taskIndex in taskListArray) {
        if (taskListArray[taskIndex].id == id) {
            deletedIndex = taskIndex;
            break;
        }
    }
    taskListArray.splice(deletedIndex, 1);
    setTasks();
    displayTasks(filterMode);
}

function editTask(id, taskName) {
    editedTaskId = id;
    isEditMode = true;
    taskInput.value = taskName;
    taskInput.focus();
    btnAddTask.innerText = "Güncelle";
    btnAddTask.classList.remove("btn-dark");
    btnAddTask.classList.add("btn-warning");
}

function uptadeStatus(id) {
    for (let i = 0; i < taskListArray.length; i++)
        if (taskListArray[i].id == id) {
            taskListArray[i].completed = !taskListArray[i].completed;
            setTasks();
            break;
        }
    displayTasks(filterMode);
}

displayTasks(filterMode);