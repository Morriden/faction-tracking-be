const { Router } = require('express');
const Membership = require('../models/membership');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Membership
      .create(req.body)
      .then(membership => res.send(membership))
      .catch(next);
  })

  .get('/membershipsbyfaction', ensureAuth, (req, res, next) => {
    Membership
      .membershipByFaction()
      .then(memberships => res.send(memberships))
      .catch(next);
  })

  .get('/org/:id', ensureAuth, (req, res, next) => {
    Membership
      .find({ faction: req.params.id })
      .populate('adventurer', { name: true })
      .then(membership => res.send(membership))
      .catch(next);
  })

  .get('/user/:id', ensureAuth, (req, res, next) => {
    Membership
      .find({ adventurer: req.params.id })
      .populate('faction', { name: true })
      .then(membership => res.send(membership))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Membership
      .deleteMembershipAndVote(req.params.id)
      .then(membership => res.send(membership))
      .catch(next);
  });
