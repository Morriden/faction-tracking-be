const mongoose = require('mongoose');

const memberships = new mongoose.Schema({
  adventurer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adventurer',
    required: true
  },
  faction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faction',
    required: true
  }
});

module.exports = mongoose.model('Membership', memberships);

//When making an adventurer we have to now include a membership

//JOIN IS EASY // .populate('faction')


