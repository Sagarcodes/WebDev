let todoArray = [];
let todolist = null;
window.onload = function () {

	let inputTodo = document.getElementById("task");
	let btnAdd = document.getElementById("addToDo");
	let btnClear = document.getElementById("clearToDo");
	todolist = document.getElementById("list");

	loadList(todolist);//parameter is not needed as it already available in the function due to closer property

	btnAdd.addEventListener("click",function(ev){
		addAndSave(inputTodo.value);
		loadList();
	});

	btnClear.addEventListener("click",clearList)
};

function saveToStorage(){
	localStorage.setItem("todos",JSON.stringify(todoArray))
}
function retrieveFromStorage(){
	let todoInStore = localStorage.getItem("todos");
	if(todoInStore){
		todoArray = JSON.parse(todoInStore);
	}
}

function saveTodoAsDone(event){
	let id = event.target.parentElement.getAttribute("data-id");
	todoArray[id].done = event.target.checked;
	saveToStorage();
	loadList();
}

function moveup(event){
	let id = event.target.parentElement.getAttribute("data-id");
	id=parseInt(id)
	todoArray.splice(id-1,0,todoArray.splice(id,1)[0]);
	saveToStorage();
	loadList();
}

function movedown(event){
	let id=event.target.parentElement.getAttribute("data-id");
	id=parseInt(id);
	todoArray.splice(id+1,0,todoArray.splice(id,1)[0]);
	saveToStorage();
	loadList();
}

function remove(event){
	let id=event.target.parentElement.getAttribute("data-id");
	todoArray.splice(id,1);
	saveToStorage();
	loadList();
}
function clearList(){
	todoArray = todoArray.filter(function(item,index,array){
		return !item.done;
	});
	saveToStorage();
	loadList();
}

function createtodolistItem(index,task,done){
	let liElement = document.createElement("li");
	let taskSpan = document.createElement("span");
	let doneCheckbox = document.createElement("input");
	let up = document.createElement("i");
	let down = document.createElement("i");
	let cross = document.createElement("i");

	liElement.className = "list-group-item";
	liElement.setAttribute("data-id",index);

	taskSpan.innerText = task;
	taskSpan.className = "col-8";

	doneCheckbox.setAttribute("type", "checkbox");
	doneCheckbox.className = "col-1";
	doneCheckbox.addEventListener("change", saveTodoAsDone);

	up.className = "fa fa-chevron-up col-1 icn-move";
	up.addEventListener("click",moveup);

	down.className = "fa fa-chevron-down col-1 icn-move";
	down.addEventListener("click",movedown);

	cross.className = "fa fa-times col-1 remove"
	cross.addEventListener("click",remove);

	if(done){
		taskSpan.className += ' todo-done';
		doneCheckbox.setAttribute("checked","true");
	}

	liElement.appendChild(doneCheckbox);
	liElement.appendChild(taskSpan);
	liElement.appendChild(up);
	liElement.appendChild(down);
	liElement.appendChild(cross);

	return liElement;
}


function loadList(){
	if(!todolist){
		return;	
	}
	retrieveFromStorage();
	todolist.innerHTML = "";
	for(index in todoArray){
		todolist.appendChild(
			createtodolistItem(index,todoArray[index].task,todoArray[index].done)
		)
	}
}

function addAndSave(inputText){
	todoArray.push({
		task:inputText,
		done:false
	});
	saveToStorage();
}


