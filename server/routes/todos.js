const express = require('express');
const router = express.Router();
const { getAllTodos, createTodo, updateTodo, patchTodo, deleteTodo, clearAllTodos } = require('../controllers/todosController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllTodos);
router.post('/', auth, createTodo);
router.put('/:id', auth, updateTodo);
router.patch('/:id', auth, patchTodo);
router.delete('/:id', auth, deleteTodo);
router.delete('/', auth, clearAllTodos);

module.exports = router;
