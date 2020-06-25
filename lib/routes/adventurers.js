const { Router } = require('express');
const Adventurer = require('../models/adventurer');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Adventurer
      .create(req.body)
      .then(adventurer => res.send(adventurer))
      .catch(next);
  })

  .get('/averageLevel', ensureAuth, (req, res, next) => {
    Adventurer
      .averageLevel()
      .then(averageLevel => res.send(averageLevel))
      .catch(next);
  })

  .get('/averageWealth', ensureAuth, (req, res, next) => {
    Adventurer
      .averageWealth()
      .then(averageWealth => res.send(averageWealth))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Adventurer
      .findById(req.params.id)
      .populate('factions')
      .then(adventurer => res.send(adventurer))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Adventurer
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(adventurer => res.send(adventurer))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Adventurer.findByIdAndDelete(req.params.id)
      .then(adventurer => res.send(adventurer))
      .catch(next);
  });

 
