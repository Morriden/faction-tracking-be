const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Adventurer = require('../lib/models/adventurer');
const Faction = require('../lib/models/faction');
const User = require('../lib/models/user');

describe('Adventurer routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let newUser;
  let newAdventurer;
  let newFaction;

  beforeEach(async() => {
    newUser = await User.create({
      email: 'test@test.com',
      passwordHash: 'password'
    });
    newAdventurer = await Adventurer.create({
      user: newUser.id,
      name: 'Morriden',
      class: 'Wizard',
      image: 'image.url',
      level: 8,
      health: 47,
      wealth: 39
    });
    newFaction = await Faction.create({
      name: 'The Harpers',
      description: 'description for the harpers organization.',
      image: 'image.url.harpers.com'
    });
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  it('creates a adventurer', () => {
    return request(app)
      .post('/api/v1/adventurers')
      .send({
        name: 'Morriden',
        class: 'Wizard',
        image: 'image.url',
        level: 8,
        health: 47,
        user: newUser.id,
        wealth: 39
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Morriden',
          class: 'Wizard',
          image: 'image.url',
          level: 8,
          health: 47,
          wealth: 39,
          user: newUser.id,
          __v: 0
        });
      });
  });

  it('get a adventurer by id', () => {
    return request(app)
      .get(`/api/v1/adventurers/${newAdventurer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          factions: [],
          _id: expect.anything(),
          name: 'Morriden',
          class: 'Wizard',
          image: 'image.url',
          level: 8,
          health: 47,
          wealth: 39,
          user: newUser.id,
          __v: 0
        });
      });
  });
  
  it('It will update a adventurer by id', () => {
    return request(app)
      .patch(`/api/v1/adventurers/${newAdventurer._id}`)
      .send({ name: 'Kartanis', class: 'Paladin', image: 'new image' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Kartanis',
          class: 'Paladin',
          image: 'new image',
          level: 8,
          health: 47,
          wealth: 39,
          user: newUser.id,
          __v: 0
        });
      });
  });
  
  it('It will delete a adventurer with id', () => {
    return request(app)
      .delete(`/api/v1/adventurers/${newAdventurer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Morriden',
          class: 'Wizard',
          image: 'image.url',
          level: 8,
          health: 47,
          wealth: 39,
          user: newUser.id,
          __v: 0
        });
      });
  });
});
