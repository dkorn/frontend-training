let todos = [];

window.onload = () => {
  handleFooter();
  document.getElementById('new-todo').addEventListener('keypress', (e) => {
      const key = e.which || e.keyCode;
      const todoInput = e.currentTarget;
      const todo = todoInput.value;
      if (key === 13 && !/^\s*$/.test(todo)) { // 13 is enter
        e.preventDefault();
        createTodoElement(todo);
        todos.push({'task': todo, 'completed': false});
        todoInput.value = '';
        handleFooter();
        handleToggle();
      }
  });
  const toggleAll = document.getElementById('toggle-all');
  const toggleClassName = todos.length > 0 ? 'toggle-all' : 'toggle-all hide';
  toggleAll.setAttribute('class', toggleClassName);
  toggleAll.addEventListener('click', (e) => {
    const check = toggleAll.checked ? true : false;
    const liElements = document.getElementById("todo-list").getElementsByTagName("li");
    for (let i = 0; i < liElements.length; i++) {
      if (liElements[i].children[0].children[0].checked !== check) {
        const text = liElements[i].children[0].children[1].textContent;
        let index = todos.findIndex((x) => (x.task === text));
        todos[index].completed = !todos[index].completed;
        liElements[i].children[0].children[0].checked = check;
      }
    }
    handleFooter();
  });
};

function removeTask (task) {
  todos = todos.filter(function(todo) {
    return todo.task !== task;
  });
}

function handleToggle () {
  const toggleAll = document.getElementById('toggle-all');
  let toggleClassName = 'toggle-all';
  if (todos.length === 0) {
    toggleClassName = 'toggle-all hide';
    toggleAll.checked = false;
  }
  toggleAll.setAttribute('class', toggleClassName);
}

function handleRemove (e) {
  const element = e.currentTarget;
  const removedText = element.previousSibling.textContent;
  element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
  removeTask(removedText);
  handleToggle();
  handleFooter();
}

function anyCompleted () {
  const completed = todos.filter(function (todo) {
    return todo.completed;
  });

  return completed.length > 0;
}

function removeCompleted () {
  // remove completed li elements
  const liElements = document.getElementById("todo-list").getElementsByTagName("li");
  let toRemove = [];
  for (let i = 0; i < liElements.length; i++) {
    if (liElements[i].children[0].children[0].checked) {
      toRemove.push(liElements[i]);
    }
  };
  toRemove.forEach(function (e) {
    e.remove()
  });

  // remove completed from todos array
  todos = todos.filter(function (todo) {
    return !todo.completed;
  });
  handleToggle();
  handleFooter();
}

function handleFooter () {
  const className = todos.length > 0 ? 'footer' : 'footer hide';
  const clearCompletedClass = anyCompleted() ? 'clear-completed' : 'clear-completed hide';
  const clearCompleted = document.getElementById('clear-completed');
  const tasksLeft = todos.filter(function (todo) {
    return !todo.completed;
  });

  document.getElementById('footer').setAttribute('class', className);
  document.getElementById('summary-text').innerHTML = tasksLeft.length + ' items left';

  clearCompleted.setAttribute('class', clearCompletedClass);
  clearCompleted.onclick = function () {
    removeCompleted();
  };
}

function createTodoElement(newTodo) {
  const newLI = document.createElement('li');
  const todoCheckbox = document.createElement('input');
  const todoContainer = document.createElement('div');
  const todoText = document.createElement('div');
  const todoRemove = document.createElement('input');

  document.getElementById('todo-list').appendChild(newLI);

  todoContainer.className = 'todo-container';
  todoCheckbox.className = 'todo-checkbox';
  todoCheckbox.type = 'checkbox';
  todoCheckbox.addEventListener('click', (e) => {
    const text = e.currentTarget.nextSibling.textContent;
    let index = todos.findIndex((x) => (x.task === text));
    todos[index].completed = !todos[index].completed;
    handleFooter();
  });

  todoText.appendChild(document.createTextNode(newTodo));
  todoText.className = 'todo-text';

  todoRemove.className = 'todo-remove';
  todoRemove.type = 'button';
  todoRemove.value = 'X';
  todoRemove.addEventListener('click', (e) => {
    handleRemove(e);
  });

  newLI.appendChild(todoContainer);

  todoContainer.appendChild(todoCheckbox);
  todoContainer.appendChild(todoText);
  todoContainer.appendChild(todoRemove);
}
