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

factions.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'faction'
});

factions.statics.deleteFactionQuestVote = function(id) {
  return Promise.all([
    this.findByIdAndDelete(id),
    this.model('Quest').deleteMany({ faction: id }),
    this.model('Vote').deleteMany({ faction: id })
  ])
    .then(([faction]) => faction);
};

module.exports = mongoose.model('Faction', factions);
