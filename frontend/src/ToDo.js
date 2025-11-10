import React, { useState, useEffect } from 'react'

function ToDo() {
    const [todoList, setTodoList] = useState([]);
    const [task, setTask] = useState('');
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      fetchTodos();
    }, []);

    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/todos');
        const data = await response.json();
        setTodoList(data);
        } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    const addTodo = async (title) => {
        if (!task.trim()) return;
      try {
        const response = await fetch('http://localhost:8000/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        const newTodo = await response.json();
        setTodoList([...todoList, newTodo]);
        setTask('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    };

    const deleteTodo = async (id) => {
      try {
        await fetch(`http://localhost:8000/api/todos/${id}`, {
            method: 'DELETE',
        });
        setTodoList(todoList.filter(todo => todo._id !== id));
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };

    const updateTodo = async (id, completed) => {
      try {
        const response = await fetch(`http://localhost:8000/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });
        const updatedTodo = await response.json();
        setTodoList(todoList.map(todo => (todo._id === id ? updatedTodo : todo)));
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    };


  return (
    <div>
        <h1>ToDo List</h1>
        <div className='todo-container'>
            <input type="text" name="task" id="task" value={task} onChange={e => setTask(e.target.value)} />
            <button onClick={() => addTodo(task)}>Add</button>
        </div>
        <div>
            {todoList.map((todo, index) => (
                <div key={todo._id} className="todo-item">
                    <input type="checkbox" name="todo-check" id="todo-check" checked={todo.completed} onChange={(e) => {
                        const updatedList = todoList.map(item => item._id === todo._id ? { ...item, completed: e.target.checked } : item);
                        setTodoList(updatedList);
                    }} />
                    <span>{todo.title}</span>
                    <button onClick={() => {
                        console.log(checked);
                        updateTodo(todo._id, !todo.completed)
                    }}>Update</button>
                    <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ToDo