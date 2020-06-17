const { Router } = require('express');
const Vote = require('../models/vote');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Vote.approvedMember(req.body, req.user)
      .then(vote => res.send(vote))
      .catch(next);
  })

  .get('/quest/:id', ensureAuth, (req, res, next) => {
    Vote
      .find({ quest: req.params.id })
      .populate('vote', { voteChosen: true })
      .then(vote => res.send(vote))
      .catch(next);
  })

  .get('/user/:id', ensureAuth, (req, res, next) => {
    Vote
      .find({ adventurer: req.params.id })
      .populate('vote', { voteChosen: true })
      .then(vote => res.send(vote))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Vote
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(vote => res.send(vote))
      .catch(next);
  });
