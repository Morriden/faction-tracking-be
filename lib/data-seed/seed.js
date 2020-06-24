const chance = require('chance').Chance();

const Faction = require('../models/Faction');
const Quest = require('../models/quest');
const Vote = require('../models/vote');
const Adventurer = require('../models/adventurer');
const User = require('../models/user');

module.exports = async({ users = 5, quests = 5, factions = 3, votes = 20, adventurers = 20, memberships = 20 } = {}) => {
  const factionName = ['The Harpers', 'The Emerald Enclave', 'The Lords Alliance'];
  const adventurerClass = ['Fighter', 'Wizard', 'Rogue', 'Bard', 'Druid', 'Cleric'];
  const questOptions = ['Option One', 'Option Two', 'Option Three'];

  const createdUsers = await User.create([...Array(users)].map(() => ({
    email: chance.email()
  })));

  const createdFactions = await Faction.create([...Array(factions)].map(() => ({
    name: chance.pickset(factionName, chance.natural({ min: 1, max: factionName.length })),
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
    class: chance.pickset(adventurerClass, chance.natural({ min: 1, max: adventurerClass.length })),
    image: chance.url(),
    level: chance.natural({ min: 1, max: 20 }),
    health: chance.natural({ min: 4, max: 100 }),
    wealth: chance.natural({ min: 1, max: 999 })
  })));

  await memberships.create([...Array(memberships)].map(() => ({
    adventurer: chance.pickone(createdAdventurers)._id,
    faction: chance.pickone(createdFactions)._id
  })));

  await Vote.create([...Array(votes)].map(() => ({
    quest: chance.pickone(createdQuests)._id,
    adventurer: chance.pickone(createdAdventurers)._id,
    voteChosen: chance.pickone(questOptions)
  })));
};
