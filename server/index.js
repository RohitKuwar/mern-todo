require('dotenv').config();
const express =  require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Use CORS for all routes (applies response headers)
app.use(cors(corsOptions));

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));


// Explicitly handle preflight (OPTIONS) requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // If origin is allowed, echo it back; otherwise block
    const origin = req.header('Origin');
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
      res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
      // if you use credentials, also return:
      // res.header('Access-Control-Allow-Credentials', 'true');
      return res.sendStatus(200);
    } else {
      return res.status(403).json({ message: 'CORS blocked' });
    }
  }
  next();
});

app.use(express.json());

app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));

app.use('/api/todos', require('./routes/todos'));

connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('🚀 server running on port', PORT);
});
