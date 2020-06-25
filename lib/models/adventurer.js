const mongoose = require('mongoose');
const { averageLevel, averageWealth } = require('./Aggregations');

const adventurers = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  class: {
    type: String,
    required: true,
    maxlength: 100
  },
  image: {
    type: String,
    required: true,
    maxlength: 999
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  health: {
    type: Number,
    required: true,
  },
  wealth: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  } }, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  },
  toObject: {
    virtuals: true
  }
}
);
adventurers.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'adventurer'
});

adventurers.virtual('factions', {
  ref: 'Faction',
  localField: '_id',
  foreignField: 'adventurer'
});

adventurers.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'adventurer'
});

adventurers.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'adventurer'
});

adventurers.statics.averageLevel = function() {
  return this.aggregate(averageLevel);
};

adventurers.statics.averageWealth = function() {
  return this.aggregate(averageWealth);
};

module.exports = mongoose.model('Adventurer', adventurers);
