export default {
  // clicking upgrades
  clicking: [
    // TODO example upgrade with every possible field
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
    },
  ],

  // TODO worker upgrades
  workers: {
    child: [
      //
    ],
  },
};
