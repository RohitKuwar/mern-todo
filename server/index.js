require('dotenv').config();
const express =  require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

const allowedOrigin = [
  'http://localhost:8000',
  'https://mern-todo-t02q.onrender.com'
];

// Allow only known origins from env (fallback to allow all in dev)
if (process.env.NODE_ENV === 'production') {
  const allowed = allowedOrigin.map(s => s.trim()).filter(Boolean);
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }));
} else {
  app.use(cors()); // dev: allow all
}
app.options('', cors());

app.use('/api/todos', require('./routes/todos'));

connectDB();

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log('🚀 server running on port', PORT);
});
