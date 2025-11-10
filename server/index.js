require('dotenv').config();
const express =  require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// dynamic CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (cURL, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed for origin: ' + origin));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // set true only if you must send cookies and then don't use origin: "*"
}));
app.options('*', cors());

app.use(express.json());

app.use('/api/todos', require('./routes/todos'));

connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('🚀 server running on port', PORT);
});
