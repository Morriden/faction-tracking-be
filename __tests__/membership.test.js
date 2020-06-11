const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Faction = require('../lib/models/faction');
const Adventurer = require('../lib/models/adventurer');
const Membership = require('../lib/models/membership');

describe('Membership routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let newFaction;
  let newAdventurer;
  let newMembership;
  
  beforeEach(async() => {
    newFaction = await Faction.create({
      name: 'The Harpers',
      description: 'description for the harpers organization.',
      image: 'image.url.harpers.com'
    });
    newAdventurer = await Adventurer.create({
      name: 'Morriden',
      class: 'Wizard',
      image: 'image.url',
      level: 8,
      health: 47,
      wealth: 39,
    });
    newMembership = await Membership.create({
      adventurer: newAdventurer._id,
      faction: newFaction._id
    });
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  it('creates a new membership', async() => {
    return request(app)
      .post('/api/v1/memberships')
      .send({
        faction: newFaction.id,
        adventurer: newAdventurer.id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          faction: newFaction._id.toString(),
          adventurer: newAdventurer._id.toString(),
          __v: 0
        });
      });
  });
  
  it('sees all users in organization', async() => {
    return request(app)
      .get(`/api/v1/memberships/org/${newFaction._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          faction: newFaction._id.toString(),
          __v: 0,
          adventurer: {
            _id: newAdventurer._id.toString(),
            name: 'Morriden',
          }
        }]);
      });
  });
    
  it('sees all organizations a user is a part of', async() => {
    return request(app)
      .get(`/api/v1/memberships/user/${newAdventurer._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          adventurer: newAdventurer._id.toString(),
          __v: 0,
          faction: {
            _id: newFaction._id.toString(),
            name: 'The Harpers',
          }
        }]);
      });
  });
    
  it('deletes the membership', async() => {
    return request(app)
      .delete(`/api/v1/memberships/${newMembership._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          __v: 0,
          adventurer: newAdventurer._id.toString(),
          faction: newFaction._id.toString()
        });
      });
  });
});
