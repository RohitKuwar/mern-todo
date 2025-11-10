import axios from "axios";

// Base URL of your backend
// If backend runs on localhost:8000, use that
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL,
  // if you use credentials/cookies set withCredentials:true and configure server accordingly
  // withCredentials: true
});

// Get all todos
export const getTodos = () => API.get("/");

// Create new todo
export const createTodo = (title) => API.post("/", { title });

// Update todo (partial)
export const patchTodo = (id, updates) => API.patch(`/${id}`, updates);

// Delete one
export const deleteTodo = (id) => API.delete(`/${id}`);

// Clear all (optional)
export const clearAllTodos = () => API.delete("/");
