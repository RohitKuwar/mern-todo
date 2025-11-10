const express = require('express');
const router = express.Router();
const { getAllTodos, createTodo, deleteTodo } = require('../controllers/todosController');

router.get('/', getAllTodos);
router.post('/', createTodo);
router.delete('/:id', deleteTodo);

module.exports = router;