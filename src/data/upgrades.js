// TODO parse big values in costs (when needed)

export default {
  // clicking upgrades
  clicking: [
    //
  ],

  // TODO generic worker upgrades
  workers: {
    child: [
      {
        order: 15,
        name: 'first upgrade',
        description: 'basdfasef',
      },
      {
        order: 10,
        name: 'god children',
        description: 'test1234',
        cost: {
          money: 1,
          reputation: 1,
        },
        requirements: {
          // TODO
        },
        adders: {
          ideas: 10,
          baseWrite: 10,
          maxWrite: 10,
          words: 10,
          efficiency: 10,
        },
        multipliers: {
          ideas: 10,
          words: 10,
          efficiency: 10,
        },
      },
    ],
    student: [
      {
        order: 1,
        name: 'student upgrade',
        description: 'basdfasef',
        cost: {
          money: 55555555555,
          reputation: 123456789,
        },
      },
    ],
  },
};

// TODO example upgrade with every possible field
/*
{
  name: 'test',
  description: 'test1234',
  cost: {
    money: 1000,
    reputation: 10,
  },
  requirements: {
    // TODO
  },
  multipliers: {
    ideas: 1.5,
    words: 1.5,
    efficiency: 1.25,
  },
  adders: {
    ideas: 1,
    baseWrite: 2,
    maxWrite: 3,
    words: 4,
    efficiency: 1,
  },
}
*/
