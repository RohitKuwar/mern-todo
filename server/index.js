require('dotenv').config();
const express =  require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/todos', require('./routes/todos'));

connectDB();

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log('🚀 server running on port', PORT);
});
