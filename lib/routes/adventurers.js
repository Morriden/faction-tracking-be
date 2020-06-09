const { Router } = require('express');
const Adventurer = require('../models/adventurer');

module.exports = Router()
  .post('/', (req, res, next) => {
    Adventurer
      .create(req.body)
      .then(adventurer => res.send(adventurer))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Adventurer
      .find(req.query)
      .select({
        name: true
      })
      .then(adventurer => res.send(adventurer))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Adventurer
      .findById(req.params.id)
      .then(adventurer => res.send(adventurer))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Adventurer.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(adventurer => res.send(adventurer))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Adventurer.findByIdAndDelete(req.params.id)
      .then(adventurer => res.send(adventurer))
      .catch(next);
  });