const todos = [];
const completed = [];

window.onload = () => {
  handleFooter(todos);
  document.getElementById('new-todo').addEventListener('keypress', (e) => {
      const key = e.which || e.keyCode;
      const todoInput = e.currentTarget;
      const todo = todoInput.value;
      if (key === 13 && !/^\s*$/.test(todo)) { // 13 is enter
        e.preventDefault();
        createTodoElement(todo);
        todos.push(todo);
        todoInput.value = '';
        handleFooter(todos);
      }
  });
};

function remove (array, item) {
  const index = array.indexOf(item);
  array.splice(index, 1);
}

function handleRemove (e, todos, completed) {
  const element = e.currentTarget;
  const removeText = element.previousSibling.textContent;
  element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
  element.checked ? remove(completed, removeText) : remove(todos, removeText);
  handleFooter(todos);
}

function handleCheck (addTo, removeFrom, item) {
  addTo.push(item);
  remove(removeFrom, item);
}

function handleFooter (todoList) {
  const className = todoList.length > 0 ? 'footer' : 'footer hide';
  document.getElementById('footer').setAttribute('class', className);
  document.getElementById('summary-text').innerHTML = todoList.length + ' items left';
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
    e.currentTarget.checked ? handleCheck(completed, todos, text) : handleCheck(todos, completed, text);
    handleFooter(todos);
  });

  todoText.appendChild(document.createTextNode(newTodo));
  todoText.className = 'todo-text';

  todoRemove.className = 'todo-remove';
  todoRemove.type = 'button';
  todoRemove.value = 'X';
  todoRemove.addEventListener('click', (e) => {
    handleRemove(e, todos, completed);
  });

  newLI.appendChild(todoContainer);

  todoContainer.appendChild(todoCheckbox);
  todoContainer.appendChild(todoText);
  todoContainer.appendChild(todoRemove);
}
