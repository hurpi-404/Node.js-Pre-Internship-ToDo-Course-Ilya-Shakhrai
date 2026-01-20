const express = require('express');
const app = express();

const metrics = {
  totalRequests: 0,
  totalResponseTime: 0,
  requestsByMethod: {},
  requestsByPath: {}
};

app.use((req, res, next) => {
  const startTime = Date.now();
  
 
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    metrics.totalRequests++;
    metrics.totalResponseTime += duration;
    metrics.requestsByMethod[req.method] = (metrics.requestsByMethod[req.method] || 0) + 1;
    metrics.requestsByPath[req.path] = (metrics.requestsByPath[req.path] || 0) + 1;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

app.get('/metrics', (req, res) => {
  res.json({
    totalRequests: metrics.totalRequests,
    averageResponseTime: metrics.totalRequests > 0 
      ? Math.round(metrics.totalResponseTime / metrics.totalRequests) 
      : 0,
    requestsByMethod: metrics.requestsByMethod,
    requestsByPath: metrics.requestsByPath
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/slow', (req, res) => {
  setTimeout(() => res.send('Slow response'), 100);
});

app.listen(3000, () => console.log('Server on port 3000'));
