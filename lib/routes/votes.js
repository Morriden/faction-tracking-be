const { Router } = require('express');
const Vote = require('../models/vote');

module.exports = Router()
  .post('/', (req, res, next) => {
    Vote
      .create(req.body)
      .then(vote => res.send(vote))
      .catch(next);
  })

  .get('/quest/:id', (req, res, next) => {
    Vote
      .find({ quest: req.params.id })
      .populate('vote', { voteChosen: true })
      .then(vote => res.send(vote))
      .catch(next);
  })

  .get('/user/:id', (req, res, next) => {
    Vote
      .find({ adventurer: req.params.id })
      .populate('vote', { voteChosen: true })
      .then(vote => res.send(vote))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Vote
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(vote => res.send(vote))
      .catch(next);
  });
