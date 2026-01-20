# Task 2: Params and Queries Challenge with Validation

## Implementation
Route `/users/:id` extracts:
- `id` from req.params (validated as number)
- `active` from req.query (validated as "true" or "false")

## How to Run
```bash
npm install express
node app.js
```

## Test Examples
```bash
# Valid request
curl http://localhost:3000/users/42?active=true
# Response: {"message":"User 42 is active"}

# Invalid id
curl http://localhost:3000/users/abc?active=true
# Response: {"error":"id must be a number"}

# Invalid active
curl http://localhost:3000/users/42?active=maybe
# Response: {"error":"active must be \"true\" or \"false\""}
```
