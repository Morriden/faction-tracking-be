const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Faction = require('../lib/models/faction');
const Quest = require('../lib/models/quest');

describe('Quests routes (poll)', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let newQuest;
  let newFaction;
  
  beforeEach(async() => {
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
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  it('creates a new quest', async() => {
    return request(app)
      .post('/api/v1/quests')
      .send({
        faction: newFaction._id,
        title: 'Find the missing wagon!',
        description: 'A wagon has gone missing!',
        options: ['Try to track', 'Ask the people around', 'Use magic']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Find the missing wagon!',
          faction: newFaction.id,
          description: 'A wagon has gone missing!',
          options: ['Try to track', 'Ask the people around', 'Use magic'],
          __v: 0
        });
      });
  });
  
  it('gets all quests for an organization', async() => {
    return request(app)
      .get(`/api/v1/quests/faction/${newFaction._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          faction: { 
            name: 'The Harpers',
            _id: expect.anything()
          },
          title: 'Find the missing wagon!',
          description: 'A wagon has gone missing!',
          options: ['Try to track', 'Ask the people around', 'Use magic'],
          __v: 0,
          _id: expect.anything()
    
        }]);
      });
  });
  
  it('gets one quest by ID', async() => {
    return request(app)
      .get(`/api/v1/quests/${newQuest._id}`)
      .then(res => {
        expect(res.body).toEqual({
          faction: {
            name: 'The Harpers',
            _id: expect.anything()
          },
          title: 'Find the missing wagon!',
          description: 'A wagon has gone missing!',
          options: ['Try to track', 'Ask the people around', 'Use magic'],
          __v: 0,
          _id: expect.anything()
        });
      });
  });
  
  it('updates a quest title or description', async() => {
    return request(app)
      .patch(`/api/v1/quests/${newQuest._id}`)
      .send({ title: 'Wagon Stolen?!?!?!' })
      .then(res => {
        expect(res.body).toEqual({
          faction: newFaction._id.toString(),
          title: 'Wagon Stolen?!?!?!',
          description: 'A wagon has gone missing!',
          options: ['Try to track', 'Ask the people around', 'Use magic'],
          __v: 0,
          _id: expect.anything()
        });
      });  
  });
  
  it('deletes a quest', async() => {
    return request(app)
      .delete(`/api/v1/quests/${newQuest._id}`)
      .then(res => {
        expect(res.body).toEqual({
          faction: newFaction._id.toString(),
          title: 'Find the missing wagon!',
          description: 'A wagon has gone missing!',
          options: ['Try to track', 'Ask the people around', 'Use magic'],
          __v: 0,
          _id: expect.anything()
        });
      });
  });
});
  
