import { useState, useEffect } from "react";
import {
  getTodos,
  createTodo,
  patchTodo,
  deleteTodo,
  clearAllTodos,
} from "./api/todos";
import "./App.css";

function ToDo() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load todos from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await getTodos();
      setTodos(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!task.trim()) return;
    try {
      if (editTodoId) {
        await patchTodo(editTodoId, { title: task });
      } else {
        await createTodo(task);
      }
      setTask("");
      setEditTodoId(null);
      fetchTodos();
    } catch (err) {
      console.error(err);
      setError("Failed to add/update todo");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (err) {
      console.error(err);
      setError("Failed to delete todo");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await patchTodo(id, { completed: !currentStatus });
      fetchTodos();
    } catch (err) {
      console.error(err);
      setError("Failed to update todo");
    }
  };

  const handleEdit = (todo) => {
    setTask(todo.title);
    setEditTodoId(todo._id);
  };

  const handleClearAll = async () => {
    try {
      await clearAllTodos();
      fetchTodos();
    } catch (err) {
      console.error(err);
      setError("Failed to clear todos");
    }
  };

  return (
    <div className="container">
      <h1 className="heading">📝 To-Do List</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="input"
        />
        <button onClick={handleAdd} className="add-btn">
          {editTodoId ? "Update" : "Add"}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {todos.length > 0 && (
        <button onClick={handleClearAll} className="clear-btn">
          Clear All
        </button>
      )}

      <ul className="list">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="list-item"
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            <span>{todo.title}</span>
            <div>
              <button
                onClick={() => handleToggle(todo._id, todo.completed)}
                className="action-btn"
              >
                {todo.completed ? "Undo" : "Done"}
              </button>
              <button
                onClick={() => handleEdit(todo)}
                className="action-btn"
                style={{ background: "#facc15" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="action-btn"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDo;
