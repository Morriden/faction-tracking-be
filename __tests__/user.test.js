const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
require('dotenv').config();

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
      password: 'password'
    });
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a new user with the post route', () => {
    return request(app)
      .post('/api/v1/users/signup')
      .send({
        email: 'test@test2.com',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          email: 'test@test2.com'
        });
      });
  });

  it('login a user via post route', () => {
    return request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'test@test.com', 
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          email: 'test@test.com'
        });
      });
  });
  it('verifys a user', () => {
    const agent = request.agent(app);

    return agent
      .post('/api/v1/users/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .then(() => {
        return agent
          .get('/api/v1/users/verify');
      })
      .then(res => {
        expect(res.body).toEqual({
          email: 'test@test.com',
          _id: expect.anything()
        });
      });
  });
});
