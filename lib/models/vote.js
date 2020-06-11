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
  voteChosen: {
    type: String,
    required: true
  } }, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  } });

votes.statics.limitOne = function(id) {
  if(this.id)
      
};

module.exports = mongoose.model('Vote', votes);
