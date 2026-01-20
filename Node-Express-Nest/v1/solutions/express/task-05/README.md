# Task 5: Request Logging and Metrics Middleware

## Implementation

Middleware that:

- Logs each request with timestamp, method, URL
- Tracks total requests, average response time
- Counts requests by method and path
- Exposes /metrics endpoint to view stats

## How to Run

```bash
npm install express
node app.js
```

## Test Examples

```bash
# Make some requests
curl http://localhost:3000/
curl http://localhost:3000/slow
curl http://localhost:3000/

# View metrics
curl http://localhost:3000/metrics
```

## Expected Metrics Response

```json
{
  "totalRequests": 3,
  "averageResponseTime": 35,
  "requestsByMethod": {
    "GET": 3
  },
  "requestsByPath": {
    "/": 2,
    "/slow": 1
  }
}
```

## Console Output

```
[2026-01-26T12:00:00.000Z] GET /
[2026-01-26T12:00:00.005Z] GET / - 200 (5ms)
[2026-01-26T12:00:01.000Z] GET /slow
[2026-01-26T12:00:01.105Z] GET /slow - 200 (105ms)
```
