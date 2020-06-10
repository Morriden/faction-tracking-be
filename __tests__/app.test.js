const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Faction = require('../lib/models/faction');
const Adventurer = require('../lib/models/adventurer');
const Membership = require('../lib/models/membership');
const Quest = require('../lib/models/quest');

describe('Faction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
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
      .post('/api/v1/factions')
      .send({
        name: 'The Harpers',
        description: 'description for the harpers organization.',
        image: 'image.url.harpers.com'
      })
      .then(() => request(app).get('/api/v1/factions'))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          name: 'The Harpers',
        }]);
      });
  });

  it('gets one faction by id with the get route', () => {
    return Faction.create({
      name: 'The Harpers',
      description: 'description for the harpers organization.',
      image: 'image.url.harpers.com'
    })
      .then(faction => request(app).get(`/api/v1/factions/${faction._id}`))
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

  it('It will update a faction by id', () => {
    return Faction.create({
      name: 'The Harpers',
      description: 'description for harpers',
      image: 'image.url'
    })
      .then(faction => {
        return request(app)
          .patch(`/api/v1/factions/${faction._id}`)
          .send({ name: 'The Emerald Enclave', description: 'description for the Emeral Enclave', image: 'new image' });
      })
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
    return Faction.create({
      name: 'The Harpers',
      description: 'description',
      image: 'image.url'
    })
      .then(faction => request(app).delete(`/api/v1/factions/${faction._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'The Harpers',
          description: 'description',
          image: 'image.url',
          __v: 0
        });
      });
  });
});

describe('Faction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a user', () => {
    return request(app)
      .post('/api/v1/adventurers')
      .send({
        name: 'Morriden',
        class: 'Wizard',
        image: 'image.url',
        level: 8,
        health: 47,
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
          __v: 0
        });
      });
  });

  it('It will update a adventurer by id', () => {
    return Adventurer.create({
      name: 'Morriden',
      class: 'Wizard',
      image: 'image.url',
      level: 8,
      health: 47,
      wealth: 39
    })
      .then(adventurer => {
        return request(app)
          .patch(`/api/v1/adventurers/${adventurer._id}`)
          .send({ name: 'Kartanis', class: 'Paladin', image: 'new image' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Kartanis',
          class: 'Paladin',
          image: 'new image',
          level: 8,
          health: 47,
          wealth: 39,
          __v: 0
        });
      });
  });

  it('It will delete a adventurer with id', () => {
    return Adventurer.create({
      name: 'Morriden',
      class: 'Wizard',
      image: 'image.url',
      level: 8,
      health: 47,
      wealth: 39
    })
      .then(adventurer => request(app).delete(`/api/v1/adventurers/${adventurer._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Morriden',
          class: 'Wizard',
          image: 'image.url',
          level: 8,
          health: 47,
          wealth: 39,
          __v: 0
        });
      });
  });
});

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
    newQuest = await Quest.create({
      title: 'Find the missing wagon!',
      description: 'A wagon has gone missing!',
      options: ['Try to track', 'Ask the people around', 'Use magic']
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

  it('creates a new poll', async() => {
    return request(app)
      .post('/api/v1/quests')
      .send({
        
        title: 'Find the missing wagon!',
        description: 'A wagon has gone missing!',
        options: ['Try to track', 'Ask the people around', 'Use magic']
      });
  });

});

// POLL MODEL = Quest model, Quest title, quest description, and options on how to solve quest? POLL
// VOTE MODEL = is reference to quest, adventurer, and reference to option selected.
// MEMBERSHIP ARE WE ALMOST DONE? We are doing it correct huzzah.
