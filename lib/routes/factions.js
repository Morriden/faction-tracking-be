const { Router } = require('express');
const Faction = require('../models/faction');

module.exports = Router()
  .post('/', (req, res, next) => {
    Faction
      .create(req.body)
      .then(faction => res.send(faction))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Faction
      .find(req.query)
      .select({
        name: true
      })
      .then(faction => res.send(faction))
      .catch(next);
  })

