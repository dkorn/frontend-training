let todos = [];

$(document).ready(() => {
  handleFooter();
  $('#new-todo').keypress((e) => {
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
  const toggleAll = $('#toggle-all');
  const toggleClassName = todos.length > 0 ? 'toggle-all' : 'toggle-all hide';
  toggleAll.attr('class', toggleClassName);
  toggleAll.click((e) => {
    const check = toggleAll.prop("checked") ? true : false;
    const liElements = $("li");
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
});

function removeTask (task) {
  todos = todos.filter(function(todo) {
    return todo.task !== task;
  });
}

function handleToggle () {
  const toggleAll = $('#toggle-all');
  let toggleClassName = 'toggle-all';
  if (todos.length === 0) {
    toggleClassName = 'toggle-all hide';
    toggleAll.checked = false;
  }
  toggleAll.attr('class', toggleClassName);
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
  const liElements = $("li");
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
  const clearCompleted = $('#clear-completed');
  const filterButtons = Array.from($('.all-button'));
  const tasksLeft = todos.filter(function (todo) {
    return !todo.completed;
  });

  $('#footer').attr('class', className);
  $('#summary-text').html(tasksLeft.length + ' items left');

  filterButtons.forEach((button) => button.onclick = (e) => {
    filterButtons.forEach((fb) => $(fb).attr('class', 'all-button'));
    $(e.currentTarget).attr('class', 'all-button active');
    filterTasks(e.currentTarget);
  });

  clearCompleted.attr('class', clearCompletedClass);
  clearCompleted.click(function () {
    $('#toggle-all').prop('checked', false);
    removeCompleted();
  });
}

function filterTasks (element) {
  const liElements = Array.from($("li"));
  liElements.forEach((li) => {
    let checked = li.querySelector('.todo-checkbox').checked;
    let className = '';
    if (element.id === 'active-button') {
      className = checked ? 'hide' : '';
    } else if (element.id === 'completed-button') {
      className = checked ? '' : 'hide';
    }
    $(li).attr('class', className);
  });
}

function createTodoElement (newTodo) {
  const newLI = $('<li></li>');
  const todoCheckbox = $('<input type="checkbox"/>');
  const todoContainer = $('<div></div>');
  const todoText = $('<div></div>').text(newTodo);
  const todoRemove = $('<input type="button"/>');

  $('#todo-list').append(newLI);

  todoContainer.attr('class', 'todo-container');
  todoCheckbox.attr('class', 'todo-checkbox');
  todoCheckbox.click((e) => {
    const text = e.currentTarget.nextSibling.textContent;
    let index = todos.findIndex((x) => (x.task === text));
    todos[index].completed = !todos[index].completed;
    handleFooter();
  });

  todoText.attr('class', 'todo-text');
  todoRemove.attr('class', 'todo-remove');
  todoRemove.val('X');
  todoRemove.click((e) => {
    handleRemove(e);
  });

  newLI.append(todoContainer);

  todoContainer.append(todoCheckbox);
  todoContainer.append(todoText);
  todoContainer.append(todoRemove);
}
