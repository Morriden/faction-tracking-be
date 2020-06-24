require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../utils/connect');
const app = require('../app');
const request = require('supertest');
const seed = require('./seed');

const agent = request.agent(app);

beforeAll(async() => {
  const uri = await mongod.getUri();
  return connect(uri);
});
  
beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed({ users: 5, quests: 5, factions: 3, votes: 20, adventurers: 20, memberships: 20 });
});

beforeEach(() => {
  return agent 
    .post('/api/v1/users/login')
    .send({
      email: 'test0@test.com',
      password: 'password'
    });
});
  
afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});


module.exports = {
  agent
};
