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

memberships.statics.deleteMembershipAndVote = function(id) {
  return Promise.all([
    this.findByIdAndDelete(id),
    this.model('Vote').deleteMany({ membership: id })
  ])
    .then(([membership]) => membership);
};

module.exports = mongoose.model('Membership', memberships);
