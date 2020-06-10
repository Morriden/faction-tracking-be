const { Router } = require('express');
const Membership = require('../models/membership');

module.exports = Router()
  .post('/', (req, res, next) => {
    Membership
      .create(req.body)
      .then(membership => res.send(membership))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Membership
      .find()
      .populate('faction', { name: true })
      .then(membership => res.send(membership))
      .catch(next);
  });
