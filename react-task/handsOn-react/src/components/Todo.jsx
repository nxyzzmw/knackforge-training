import { useState } from "react";

function Todo() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  function addTodo() {
    if (!input.trim()) return;

    setTodos([...todos, { text: input, completed: false }]);
    setInput("");
  }

  function del(indexToDelete) {
    setTodos(todos.filter((_, index) => index !== indexToDelete));
  }

  return (
    <div className="page">
      <div className="todo-card">
        <h2 className="title">To-Do List</h2>

        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a todo..."
          />
          <button className="todo-btn" onClick={addTodo}>Add</button>
        </div>

        <ul className="todo-items">
          {todos.map((todo, index) => (
            <li key={index}>
              <span>{todo.text}</span>

              <button className="dec-btn" onClick={() => del(index)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
