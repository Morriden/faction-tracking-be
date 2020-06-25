const { agent } = require('../lib/data-seed/data-helper');

const Adventurer = require('../lib/models/adventurer');
const User = require('../lib/models/user');

describe('Adventurer routes', () => {
  
  it('creates a adventurer', async() => {
    const newUser = await User.findOne();
    
    return agent
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

  it('get a adventurer by id', async() => {
    const newAdventurer = await Adventurer.findOne();

    return agent
      .get(`/api/v1/adventurers/${newAdventurer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          factions: [],
          _id: expect.anything(),
          name: newAdventurer.name,
          class: newAdventurer.class,
          image: newAdventurer.image,
          level: newAdventurer.level,
          health: newAdventurer.health,
          wealth: newAdventurer.wealth,
          user: newAdventurer.user.toString(),
          __v: 0
        });
      });
  });
  
  it('It will update a adventurer by id', async() => {
    const newAdventurer = await Adventurer.findOne();

    return agent
      .patch(`/api/v1/adventurers/${newAdventurer._id}`)
      .send({ name: 'Kartanis', class: 'Paladin', image: 'new image' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Kartanis',
          class: 'Paladin',
          image: 'new image',
          level: newAdventurer.level,
          health: newAdventurer.health,
          wealth: newAdventurer.wealth,
          user: newAdventurer.user.toString(),
          __v: 0
        });
      });
  });
  
  it('It will delete a adventurer with id', async() => {
    const newAdventurer = await Adventurer.findOne();

    return agent
      .delete(`/api/v1/adventurers/${newAdventurer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: newAdventurer.name,
          class: newAdventurer.class,
          image: newAdventurer.image,
          level: newAdventurer.level,
          health: newAdventurer.health,
          wealth: newAdventurer.wealth,
          user: newAdventurer.user.toString(),
          __v: 0
        });
      });
  });
});
