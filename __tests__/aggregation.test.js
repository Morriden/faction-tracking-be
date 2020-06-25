const { agent } = require('../lib/data-seed/data-helper');

describe('aggregation routes', () => {
    
  it('gets average levels of classes', async() => {
    return agent
      .get('/api/v1/adventurers/averageLevel')
      .then(res => {
        expect(res.body).toEqual([
          { _id: expect.anything(), averageLevel: expect.any(Number) },
          { _id: expect.anything(), averageLevel: expect.any(Number) },
          { _id: expect.anything(), averageLevel: expect.any(Number) },
          { _id: expect.anything(), averageLevel: expect.any(Number) },
          { _id: expect.anything(), averageLevel: expect.any(Number) },
          { _id: expect.anything(), averageLevel: expect.any(Number) }
        ]);
      });
  });

  it('Shows how many Memberships by faction', async() => {
    return agent
      .get('/api/v1/memberships/membershipsbyfaction')
      .then(res => {
        expect(res.body).toEqual([
          { _id: expect.anything(), membershipsByFaction: expect.any(Number) },
          { _id: expect.anything(), membershipsByFaction: expect.any(Number) },
          { _id: expect.anything(), membershipsByFaction: expect.any(Number) }
        ]);
      });
  });

  it('Get the average Wealth by classes', async() => {
    const answer = { _id: expect.any(String), totalClassWealthAVG: expect.any(Number) };

    return agent
      .get('/api/v1/adventurers/averageWealth')
      .then(res => {
        expect(res.body).toContainEqual(answer);
      });
  });

  it('Gets the total Votes on a quest', async() => {
    const answer = { _id: expect.any(String), totalVotes: expect.any(Number) };

    return agent
      .get('/api/v1/votes/totalVotes')
      .then(res => {
        expect(res.body).toContainEqual(answer);
      });
  });
});
