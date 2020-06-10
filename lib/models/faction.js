const mongoose = require('mongoose');

const factions = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  image: {
    type: String,
    required: true,
    maxlength: 999
  }
});

factions.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'faction'
});

module.exports = mongoose.model('Faction', factions);
