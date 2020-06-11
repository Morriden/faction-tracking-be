const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/factions', require('./routes/factions'));
app.use('/api/v1/adventurers', require('./routes/adventurers'));
app.use('/api/v1/memberships', require('./routes/memberships'));
app.use('/api/v1/quests', require('./routes/quests'));
app.use('/api/v1/votes', require('./routes/votes'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
