const express = require('express');
const router = express.Router();
const { getAllTodos, createTodo, updateTodo, patchTodo, deleteTodo, clearAllTodos } = require('../controllers/todosController');

router.get('/', getAllTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id', patchTodo);
router.delete('/:id', deleteTodo);
router.delete('/', clearAllTodos);

module.exports = router;