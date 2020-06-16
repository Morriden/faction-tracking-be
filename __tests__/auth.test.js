const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/user');

describe('Auth routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let newUser;

  beforeEach(async() => {
    newUser = await User.create({
      email: 'test@test.com',
      passwordHash: 'password'
    });
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
});
