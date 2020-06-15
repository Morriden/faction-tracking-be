const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Faction = require('../lib/models/faction');
const Quest = require('../lib/models/quest');
const Adventurer = require('../lib/models/adventurer');
const Vote = require('../lib/models/vote');

describe('Membership routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
    
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let newQuest;
  let newFaction;
  let newAdventurer;
  let newVote;

  beforeEach(async() => {
    newAdventurer = await Adventurer.create({
      name: 'Erik',
      class: 'Wizard',
      image: 'image url',
      level: 1,
      health: 10,
      wealth: 3
    });
    newFaction = await Faction.create({
      name: 'The Harpers',
      description: 'description for the harpers organization.',
      image: 'image.url.harpers.com'
    });
    newQuest = await Quest.create({
      faction: newFaction.id,
      title: 'Find the missing wagon!',
      description: 'A wagon has gone missing!',
      options: ['Try to track', 'Ask the people around', 'Use magic']
    });
    newVote = await Vote.create({
      quest: newQuest.id,
      adventurer: newAdventurer.id,
      voteChosen: 'Try to track'
    });
  });
    
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('create a new vote', async() => {
    return request(app)
      .post('/api/v1/votes')
      .send({
        adventurer: newAdventurer._id,
        quest: newQuest._id,
        voteChosen: 'Try to track'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          adventurer: newAdventurer.id,
          quest: newQuest.id,
          voteChosen: 'Try to track',
          __v: 0
        });
      });
  });

  it('Should update the original vote', async() => {
    return request(app)
      .post('/api/v1/votes')
      .send({
        adventurer: newAdventurer._id,
        quest: newQuest._id,
        voteChosen: 'Try to track'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          adventurer: newAdventurer.id,
          quest: newQuest.id,
          voteChosen: 'Try to track',
          __v: 0
        });
      });
  });

  it('get all votes on a quest', async() => {
    return request(app)
      .get(`/api/v1/votes/quest/${newQuest._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          adventurer: newAdventurer.id,
          quest: newQuest.id,
          voteChosen: 'Try to track',
          __v: 0      
        }]);
      });
  });

  it('get all votes by a user', async() => {
    return request(app)
      .get(`/api/v1/votes/user/${newAdventurer._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          adventurer: newAdventurer.id,
          quest: newQuest.id,
          voteChosen: 'Try to track',
          __v: 0
        }]);
      });
  });

  it('change what you voted for', async() => {
    return request(app)
      .patch(`/api/v1/votes/${newVote._id}`)
      .send({ voteChosen: 'Ask the people around' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          adventurer: newAdventurer.id,
          quest: newQuest.id,
          voteChosen: 'Ask the people around',
          __v: 0
        });
      });
  });
});
