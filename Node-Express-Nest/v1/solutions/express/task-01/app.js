const express = require('express');
const app = express();
app.use((req, res, next) => {
  console.log(`[Logger] ${req.method} ${req.url}`);
  next();
});
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    console.log(`[Timer] Request took ${Date.now() - req.startTime}ms`);
  });
  next();
});
app.use((req, res, next) => {
  res.setHeader('X-Custom-Header', 'Express-Middleware');
  console.log('[Header] Custom header injected');
  next();
});
app.get('/', (req, res) => {
  res.send('Middleware sequence executed!');
});

app.listen(3000, () => console.log('Server is on 3000 port'));
