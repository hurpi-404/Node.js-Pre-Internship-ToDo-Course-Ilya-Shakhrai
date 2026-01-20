const express = require('express');
const app = express();

app.get('/error', (req, res, next) => {
  const error = new Error('Something went wrong!');
  error.status = 500;
  next(error);
});

app.get('/not-found', (req, res, next) => {
  const error = new Error('Resource not found');
  error.status = 404;
  next(error);
});

app.get('/success', (req, res) => {
  res.json({ message: 'Success!' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(3000, () => console.log('Server on port 3000'));
