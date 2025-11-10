const Todo = require('../models/Todo');

const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createTodo = async (req, res) => {
    try {
        const { title } = req.body;
        if(!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const newTodo = new Todo({ title });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if(!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params; // get todo id from URL (e.g. /api/todos/:id)
    const { title, completed } = req.body; // get updated fields from request body

    // find todo by id and update it
    const updatedTodo = await Todo.findByIdAndUpdate(
      id, // which document to update
      { title, completed }, // new data
      { new: true, runValidators: true } // options: return updated doc + validate schema
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo); // send updated todo back to client
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const patchTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // only fields provided will be updated

    // find the todo and apply partial updates
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: updates },        // use $set to only change provided fields
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const clearAllTodos = async (req, res) => {
  try {
    const result = await Todo.deleteMany({});
    res.json({
      success: true,
      message: `${result.deletedCount} todos deleted`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
    patchTodo,
    deleteTodo,
    clearAllTodos
};