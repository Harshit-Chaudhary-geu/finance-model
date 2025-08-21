const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors')

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;