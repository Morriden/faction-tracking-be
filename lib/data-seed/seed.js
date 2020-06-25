require('dotenv').config();

const chance = require('chance').Chance();

const Faction = require('../models/Faction');
const Quest = require('../models/quest');
const Vote = require('../models/vote');
const Adventurer = require('../models/adventurer');
const User = require('../models/user');
const Membership = require('../models/Membership');

module.exports = async({ users = 100, quests = 15, factions = 5, votes = 40, adventurers = 100, memberships = 100 } = {}) => {
  const factionName = ['The Harpers', 'The Emerald Enclave', 'The Lords Alliance'];
  const adventurerClass = ['Fighter', 'Wizard', 'Rogue', 'Bard', 'Druid', 'Cleric'];
  const questOptions = ['Option One', 'Option Two', 'Option Three'];

  const createdUsers = await User.create([...Array(users)].map((_, i) => ({
    email: `test${i}@test.com`,
    password: 'password'
  })));

  const createdFactions = await Faction.create([...Array(factions)].map(() => ({
    name: chance.pickone(factionName),
    description: chance.paragraph({ sentences: 2 }),
    image: chance.sentence()
  })));

  const createdQuests = await Quest.create([...Array(quests)].map(() => ({
    faction: chance.pickone(createdFactions)._id,
    title: chance.sentence(),
    description: chance.paragraph({ sentences: 2 }),
    options: questOptions
  })));

  const createdAdventurers = await Adventurer.create([...Array(adventurers)].map(() => ({
    user: chance.pickone(createdUsers)._id,
    name: chance.name(),
    class: chance.pickone(adventurerClass),
    image: chance.url(),
    level: chance.natural({ min: 1, max: 20 }),
    health: chance.natural({ min: 4, max: 100 }),
    wealth: chance.natural({ min: 1, max: 999 })
  })));

  await Membership.create([...Array(memberships)].map(() => ({
    adventurer: chance.pickone(createdAdventurers)._id,
    faction: chance.pickone(createdFactions)._id
  })));

  await Vote.create([...Array(votes)].map(() => ({
    quest: chance.pickone(createdQuests)._id,
    adventurer: chance.pickone(createdAdventurers)._id,
    voteChosen: chance.pickone(questOptions)
  })));
};
