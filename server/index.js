require('dotenv').config();
const express =  require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const allowedOrigins = [
  'http://localhost:8000',          // local dev
  'https://mern-todo-t02q.onrender.com' // 👈 update this after frontend deploy
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use('/api/todos', require('./routes/todos'));

connectDB();

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log('🚀 server running on port', PORT);
});
