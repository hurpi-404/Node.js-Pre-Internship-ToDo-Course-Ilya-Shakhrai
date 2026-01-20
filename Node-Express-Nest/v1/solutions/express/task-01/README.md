# Task 1: Middleware Playground

## Implementation
Three middlewares are registered in sequence:
1. Logger - logs HTTP method and URL
2. Timer - measures request duration
3. Header Injector - adds custom header to response

## How to Run
```bash
npm install express
node app.js
```

## Test
```bash
curl http://localhost:3000/
```

## Expected Console Output
```
[Logger] GET /
[Header] Custom header injected
[Timer] Request took 5ms
```
