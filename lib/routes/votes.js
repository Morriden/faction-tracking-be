const { Router } = require('express');
const Vote = require('../models/vote');

module.exports = Router()
  .post('/', (req, res, next) => {
    Vote
      .create(req.body)
      .then(quest => res.send(quest))
      .catch(next);
  });
