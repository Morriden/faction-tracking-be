const { Router } = require('express');
const Membership = require('../models/membership');

module.exports = Router()
  .post('/', (req, res, next) => {
    Membership
      .create(req.body)
      .then(membership => res.send(membership))
      .catch(next);
  })

  .get('/org/:id', (req, res, next) => {
    Membership
      .find({ faction: req.params.id })
      .populate('adventurer', { name: true })
      .then(membership => res.send(membership))
      .catch(next);
  })

  .get('/user/:id', (req, res, next) => {
    Membership
      .find({ adventurer: req.params.id })
      .populate('faction', { name: true })
      .then(membership => res.send(membership))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Membership
      .findByIdAndDelete(req.params.id)
      .then(membership => res.send(membership))
      .catch(next);
  });
