const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(morgan('dev'));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  '/uploads',
  express.static(path.resolve(__dirname, 'uploads'))
);

app.get('/api/health', (req, res) => {
  console.log('Health endpoint hit');
  res.json({ status: 'ok' });
});

// Mount ALL API routes
app.use('/api', routes);


const { notFound, errorHandler } = require('./middleware/errorHandler');

// Mount API routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;