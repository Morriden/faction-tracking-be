const averageLevel = [
  {
    '$group': {
      '_id': '$class', 
      'averageLevel': {
        '$avg': '$level'
      }
    }
  }, {
    '$sort': {
      'averageLevel': 1
    }
  }
];

const membershipByFaction = [
  {
    '$group': {
      '_id': '$faction', 
      'membershipsByFaction': {
        '$sum': 1
      }
    }
  }, {
    '$sort': {
      'membershipsByFaction': 1
    }
  }
];

const averageWealth = [
  {
    '$group': {
      '_id': '$class', 
      'totalClassWealthAVG': {
        '$avg': '$wealth'
      }
    }
  }, {
    '$sort': {
      'totalClassWealthAVG': 1
    }
  }
];

const totalVotes = [
  {
    '$group': {
      '_id': '$quest', 
      'totalVotes': {
        '$sum': 1
      }
    }
  }, {
    '$sort': {
      'totalVotes': -1
    }
  }
];

module.exports = {
  averageLevel,
  membershipByFaction,
  averageWealth,
  totalVotes
  
};
