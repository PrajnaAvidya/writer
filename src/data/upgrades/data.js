export default {
  // infinite/procedural upgrades
  /*
  wordValue: {
    base: 100,
    scale: 10,
    multiplier: 2,
  },
  */
  clicking: {
    base: 100,
    scale: 10,
    multiplier: 2,
  },
  caffeinePower: {
    base: 1000,
    scale: 25,
    multiplier: 2,
  },
  jobReward: {
    base: 100,
    scale: 50,
    multiplier: 2,
  },
  urgentJobReward: {
    base: 1E5,
    scale: 100,
    multiplier: 2,
  },

  // static upgrades
  caffeine: [
    // caffeine length
    {
      cost: 1E2,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E4,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E6,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E8,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E10,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E12,
      lengthMultiplier: 1.5,
    },
    // caffeine cooldown reduction
    {
      cost: 1E3,
      cooldownReduction: 30,
    },
    {
      cost: 1E4,
      cooldownReduction: 30,
    },
    {
      cost: 1E5,
      cooldownReduction: 30,
    },
    {
      cost: 1E6,
      cooldownReduction: 30,
    },
    {
      cost: 1E7,
      cooldownReduction: 30,
    },
    {
      cost: 1E8,
      cooldownReduction: 30,
    },
    {
      cost: 1E9,
      cooldownReduction: 30,
    },
    {
      cost: 1E10,
      cooldownReduction: 30,
    },
    {
      cost: 1E11,
      cooldownReduction: 30,
    },
    {
      cost: 1E12,
      cooldownReduction: 30,
    },
  ],

  // worker upgrade costs are multiples of worker base cost
  genericWorker: [
    {
      cost: 10,
      requirement: 1,
      multiplier: 2,
    },
    {
      cost: 50,
      requirement: 5,
      multiplier: 2,
    },
    {
      cost: 500,
      requirement: 25,
      multiplier: 2,
    },
    {
      cost: 5E4,
      requirement: 50,
      multiplier: 2,
    },
    {
      cost: 5E6,
      requirement: 100,
      multiplier: 2,
    },
    {
      cost: 5E8,
      requirement: 150,
      multiplier: 2,
    },
    { // + 3e cost, +50 req
      cost: 5E11,
      requirement: 200,
      multiplier: 2,
    },
    {
      cost: 5E14,
      requirement: 250,
      multiplier: 2,
    },
    {
      cost: 5E17,
      requirement: 300,
      multiplier: 2,
    },
    {
      cost: 5E20,
      requirement: 350,
      multiplier: 2,
    },
    { // +4e cost, +50 req
      cost: 5E24,
      requirement: 400,
      multiplier: 2,
    },
    {
      cost: 5E28,
      requirement: 450,
      multiplier: 2,
    },
    {
      cost: 5E32,
      requirement: 500,
      multiplier: 2,
    },
  ],

  // jobs
  jobs: [
    // cooldown reduction
    {
      cost: 1E2,
      cooldownReduction: 10,
    },
    {
      cost: 1E3,
      cooldownReduction: 10,
    },
    {
      cost: 1E4,
      cooldownReduction: 10,
    },
    {
      cost: 1E5,
      cooldownReduction: 10,
    },
    {
      cost: 1E6,
      cooldownReduction: 10,
    },
    {
      cost: 1E7,
      cooldownReduction: 10,
    },
    {
      cost: 1E8,
      cooldownReduction: 10,
    },
    {
      cost: 1E9,
      cooldownReduction: 10,
    },
    {
      cost: 1E10,
      cooldownReduction: 10,
    },
    {
      cost: 1E11,
      cooldownReduction: 10,
    },
    {
      cost: 1E12,
      cooldownReduction: 10,
    },
    {
      cost: 1E13,
      cooldownReduction: 10,
    },
  ],

  // urgent jobs
  urgentJobs: [
    {
      cost: 5E3,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 5E6,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 5E9,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 5E4,
      timerMultiplier: 1.5,
    },
    {
      cost: 5E7,
      timerMultiplier: 1.5,
    },
    {
      cost: 5E10,
      timerMultiplier: 1.5,
    },
  ],
};
