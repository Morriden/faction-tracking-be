const mongoose = require('mongoose');
const { totalVotes } = require('./Aggregations');

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
    required: true,
  } }, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  } });

votes.statics.approvedMember = async function(vote, loggInUser) {
  const quest = await this.model('Quest').findById(vote.quest);
  const adventurer = await this.model('Adventurer').findOne({ user: loggInUser._id });
  if(!adventurer) throw new Error('No Account Setup');
  const membership = await this.model('Membership').findOne({ adventurer: adventurer._id, faction: quest.faction });
  if(!membership) throw new Error('Not a Member');
  return this.findOneAndUpdate(
    { quest: vote.quest, adventurer: adventurer._id },
    { ...vote, adventurer: adventurer._id },
    { upsert: true, new: true });
};

votes.statics.totalVotes = function() {
  return this.aggregate(totalVotes);
};

module.exports = mongoose.model('Vote', votes);
