const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Faction = require('../lib/models/faction');
const Quest = require('../lib/models/quest');
const vote = require('../lib/models/vote');
const Adventurer = require('../lib/models/adventurer');

describe('Faction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let newQuest;
  let newFaction;
  let newVote;
  let newAdventurer;

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
    newVote = await vote.create({
      quest: newQuest.id,
      adventurer: newAdventurer.id,
      voteChosen: 'Try to track'
    });
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  it('create a faction with post route', () => {
    return request(app)
      .post('/api/v1/factions')
      .send({
        name: 'The Harpers',
        description: 'description for the harpers organization.',
        image: 'image.url.harpers.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'The Harpers',
          description: 'description for the harpers organization.',
          image: 'image.url.harpers.com',
          __v: 0
        });
      });
  });
  
  it('gets all factions with the get route', () => {
    return request(app)
      .get('/api/v1/factions')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          name: 'The Harpers',
        }]);
      });
  });
  
  it('gets one faction by id with the get route', () => {
    return request(app)
      .get(`/api/v1/factions/${newFaction._id}`)
      .then(res => {
        expect(res.body).toEqual({
          memberships: [],
          _id: expect.anything(),
          name: 'The Harpers',
          description: 'description for the harpers organization.',
          image: 'image.url.harpers.com',
          __v: 0
        });
      });
  });

  it('gets one faction by id and shows all of members a part of it', () => {
    return request(app)
      .get(`/api/v1/factions/${newFaction._id}`)
      .then(res => {
        expect(res.body).toEqual({
          memberships: [],
          _id: expect.anything(),
          name: 'The Harpers',
          description: 'description for the harpers organization.',
          image: 'image.url.harpers.com',
          __v: 0
        });
      });
  });
  
  it('It will update a faction by id', () => {
    return request(app)
      .patch(`/api/v1/factions/${newFaction._id}`)
      .send({ name: 'The Emerald Enclave', description: 'description for the Emeral Enclave', image: 'new image' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'The Emerald Enclave',
          description: 'description for the Emeral Enclave',
          image: 'new image',
          __v: 0
        });
      });
  });
  it('It will delete a faction with id', () => {
    return request(app)
      .delete(`/api/v1/factions/${newFaction._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'The Harpers',
          description: 'description for the harpers organization.',
          image: 'image.url.harpers.com',
          __v: 0
        });
      });
  });

  it('It will delete a faction and all quests and votes assosciated with it', () => {
    return request(app)
      .delete(`/api/v1/factions/${newFaction._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'The Harpers',
          description: 'description for the harpers organization.',
          image: 'image.url.harpers.com',
          __v: 0
        });

        return Quest.find({ faction: newFaction._id });
      })
      .then(quest => {
        expect(quest).toEqual([]);
      });
  });
});
