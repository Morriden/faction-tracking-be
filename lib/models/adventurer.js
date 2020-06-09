const mongoose = require('mongoose');

const adventurers = new mongoose.Schema({
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
  }
    
});

module.exports = mongoose.model('Adventurer', adventurers);
