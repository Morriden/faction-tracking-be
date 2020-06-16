const { Router } = require('express');
const Quest = require('../models/quest');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Quest
      .create(req.body)
      .then(quest => res.send(quest))
      .catch(next);
  })

  .get('/faction/:id', ensureAuth, (req, res, next) => {
    Quest
      .find({ faction: req.params.id })
      .populate('faction', { name: true })
      .then(quest => res.send(quest))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Quest
      .findById(req.params.id)
      .populate('faction', { name: true })
      .then(quest => res.send(quest))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Quest
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(quest => res.send(quest))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Quest
      .findByIdAndDelete(req.params.id)
      .then(quest => res.send(quest))
      .catch(next);
  });
