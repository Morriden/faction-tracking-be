const { Router } = require('express');
const Faction = require('../models/faction');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Faction
      .create(req.body)
      .then(faction => res.send(faction))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Faction
      .find(req.query)
      .select({
        name: true
      })
      .then(faction => res.send(faction))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Faction
      .findById(req.params.id)
      .populate('memberships')
      .then(faction => res.send(faction))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Faction.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(faction => res.send(faction))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Faction
      .deleteFactionQuestVote(req.params.id)
      .then(faction => res.send(faction))
      .catch(next);
  });
