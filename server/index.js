require('dotenv').config();
const express =  require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://mern-todo-app-tau-liart.vercel.app/',
  'https://mern-todo-6acsfy5wy-rohitkuwars-projects.vercel.app'  // frontend deployment URL
];

app.use(cors({
  origin: "*",
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
