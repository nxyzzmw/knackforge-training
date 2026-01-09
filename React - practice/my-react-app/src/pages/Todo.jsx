import { useState } from "react";

function Todo() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  function addTodo() {
    if (!input.trim()) return;

    setTodos([...todos, { text: input, completed: false }]);
    setInput("");
  }

  function toggleStrike(index) {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
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
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <ul className="todo-items">
          {todos.map((todo, index) => (
            <li
              key={index}
              onClick={() => toggleStrike(index)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
                fontWeight: todo.completed ? "600" : "400"
              }}
            >
              • {todo.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
