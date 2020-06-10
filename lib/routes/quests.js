const { Router } = require('express');
const Quest = require('../models/quest');

module.exports = Router()
  .post('/', (req, res, next) => {
    Quest
      .create(req.body)
      .then(quest => res.send(quest))
      .catch(next);
  });
