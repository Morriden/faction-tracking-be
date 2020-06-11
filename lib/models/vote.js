const mongoose = require('mongoose');

const votes = new mongoose.Schema({
  quest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true
  },
  adventurer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adventurer',
    required: true
  },
  vote: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Vote', votes);
