let addButton = document.getElementById("add-task-button");
let taskList = document.getElementById("task-list");


function insertHTML() {
    taskList.insertAdjacentHTML("beforeend", "<li>\n" +
        "            <input class=\"checkbox-btn\" type=\"checkbox\" onclick=\"completeTask(this)\" />\n" +
        "            <span class=\"task\"></span>\n" +
        "            <button class=\"delete-btn\" onclick=\"deleteTask(this)\"><img src=\"graphics/Delete%202.svg\" alt=\"delete-button\" /></button>\n" +
        "        </li>");
}


addButton.addEventListener("click", function () {
    let inputTask = document.getElementById("input-task").value;
    // Passing HTML when a new task is added
    if (inputTask !== "") {
        insertHTML();
        let taskNameList = document.querySelectorAll(".task");
        taskNameList[taskNameList.length - 1].innerText = inputTask;

        document.getElementById("input-task").value = null;
        setNumOnTasks();

        // Saving data to localStorage
        let taskNum = taskList.lastElementChild.getAttribute("task-num");
        localStorage.setItem(`taskData${taskNum}`, inputTask);
    }
    // In case of empty input
    else {
        alert("Enter a task!");
    }
});


// Setting number on task items
function setNumOnTasks() {
    let listItemArray = document.querySelectorAll("li");
    listItemArray.forEach((element, index) => {
       element.setAttribute("task-num", String(index + 1));
    });
}
window.onload = (event) => {
    setNumOnTasks();
};


// onclick function for delete-btn
// Deleting a task
function deleteTask(obj) {
    // Deleting data from localStorage
    localStorage.removeItem(`taskData${obj.parentElement.getAttribute("task-num")}`)
    
    // Correcting the order of `taskData${}` key in localStorage after task deletion
    let taskDataArray = [];
    let keys = Object.keys(localStorage);
    for(let key of keys) {
        taskDataArray.push(localStorage.getItem(key));
    }
    // Cloning dataArray
    let copyDataArray = [...taskDataArray];
    localStorage.clear();
    copyDataArray.forEach(function (data, index) {
        localStorage.setItem(`taskData${index + 1}`, data);
    });
    
    obj.parentElement.remove();
    setNumOnTasks();
}


// onclick function for checkbox
// Striking through a completed task and vice-versa
function completeTask(obj) {
    let taskNum = obj.parentElement.getAttribute("task-num");
    let oldValue = localStorage.getItem(`taskData${taskNum}`);
    
    if (obj.checked) {
        obj.nextElementSibling.classList.add("completed-task");
        
        // Updating state of task in localStorage
        localStorage.setItem(`taskData${taskNum}`, oldValue + "=completed");
    }
    else {
        obj.nextElementSibling.classList.remove("completed-task");

        // Updating state of task in localStorage
        localStorage.setItem(`taskData${taskNum}`, oldValue.slice(0, -10));
    }
}


window.onload = (event) => {
    if (localStorage.length > 0) {
        let taskDataArray = [];
        let keys = Object.keys(localStorage);
        for(let key of keys) {
            taskDataArray.push(localStorage.getItem(key));
        }
        taskDataArray.forEach((data) => {
            insertHTML();
            if (data.endsWith("=completed")) {
                let taskNameList = document.querySelectorAll(".task");
                let contentElement = taskNameList[taskNameList.length - 1];
                contentElement.innerText = data.slice(0, -10);
                contentElement.classList.add("completed-task");
                contentElement.previousElementSibling.checked = true;
            }
            else {
                let taskNameList = document.querySelectorAll(".task");
                taskNameList[taskNameList.length - 1].innerText = data;
            }
        });
        setNumOnTasks();
    }
};