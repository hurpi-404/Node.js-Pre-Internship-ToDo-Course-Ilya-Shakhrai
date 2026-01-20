# Task 3: Centralized Error Handler

## Implementation
Custom error middleware catches all errors thrown with next(error).
Formats response as: { status, message, timestamp }

## How to Run
```bash
npm install express
node app.js
```

## Test Examples
```bash
# Trigger 500 error
curl http://localhost:3000/error
# Response: {"status":500,"message":"Something went wrong!","timestamp":"2024-01-01T12:00:00.000Z"}

# Trigger 404 error
curl http://localhost:3000/not-found
# Response: {"status":404,"message":"Resource not found","timestamp":"2024-01-01T12:00:00.000Z"}

# Success route
curl http://localhost:3000/success
# Response: {"message":"Success!"}
```
