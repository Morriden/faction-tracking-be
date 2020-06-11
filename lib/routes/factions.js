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

  .get('/:id', (req, res, next) => {
    Faction
      .findById(req.params.id)
      .populate('memberships')
      .then(faction => res.send(faction))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Faction.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(faction => res.send(faction))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Faction
      .deleteFactionQuestVote(req.params.id)
      .then(faction => res.send(faction))
      .catch(next);
  });
