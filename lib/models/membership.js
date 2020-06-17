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

//if member of faction => allow to create faction.
//1) get member id?

//2) compare if member is part of faction
//3) if false return error
//4) if true allow the post to happen.

module.exports = mongoose.model('Membership', memberships);
