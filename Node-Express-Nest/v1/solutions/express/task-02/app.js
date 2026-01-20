const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const { active } = req.query;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  if (active && active !== 'true' && active !== 'false') {
    return res.status(400).json({ error: 'active must be "true" or "false"' });
  }

  const status = active === 'true' ? 'active' : active === 'false' ? 'inactive' : 'unknown';
  res.json({ message: `User ${id} is ${status}` });
});

app.listen(3000, () => console.log('Server on port 3000'));
