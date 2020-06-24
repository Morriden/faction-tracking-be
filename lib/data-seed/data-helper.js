require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const seed = require('./seed');

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
  
afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});
