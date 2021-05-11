const addOneItem = (state, todoItem) => {
    const obj = {completed : false, item : todoItem};
    localStorage.setItem(todoItem, JSON.stringify(obj));
    state.todoItems.push(obj);
    console.log(this);
}

const removeOneItem = (state, obj) => {
    localStorage.removeItem(obj.todoItem.item);
    state.todoItems.splice(obj.index, 1);
}

const toggleOneItem = (state, obj) => {
    state.todoItems[obj.index].completed = !state.todoItems[obj.index].completed;
    localStorage.removeItem(obj.todoItem.item);
    localStorage.setItem(obj.todoItem.item, JSON.stringify(obj.todoItem));
}

const clearLocal = (state) => {
    localStorage.clear();
    state.todoItems = [];
}

export { addOneItem, removeOneItem, toggleOneItem, clearLocal }