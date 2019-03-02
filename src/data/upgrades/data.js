export default {
  // infinite/procedural upgrades
  clicking: {
    base: 500,
    scale: 25,
    multiplier: 2,
  },
  jobReward: {
    base: 100,
    scale: 100,
    multiplier: 2,
  },
  urgentJobReward: {
    base: 1E6,
    scale: 1000,
    multiplier: 2,
  },

  // static upgrades
  caffeine: [
    // caffeine length
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
      cost: 1E2,
      cooldownReduction: 30,
    },
    {
      cost: 1E4,
      cooldownReduction: 30,
    },
    {
      cost: 1E6,
      cooldownReduction: 30,
    },
    {
      cost: 1E8,
      cooldownReduction: 30,
    },
    {
      cost: 1E10,
      cooldownReduction: 30,
    },
    {
      cost: 1E12,
      cooldownReduction: 30,
    },
    {
      cost: 1E14,
      cooldownReduction: 30,
    },
    {
      cost: 1E16,
      cooldownReduction: 30,
    },
    {
      cost: 1E18,
      cooldownReduction: 30,
    },
    {
      cost: 1E20,
      cooldownReduction: 29,
    },
  ],

  // worker upgrade costs are multiples of worker base cost
  genericWorker: [
    {
      cost: 100,
      requirement: 1,
      multiplier: 2,
    },
    {
      cost: 500,
      requirement: 5,
      multiplier: 2,
    },
    {
      cost: 5000,
      requirement: 25,
      multiplier: 2,
    },
    {
      cost: 5E5,
      requirement: 50,
      multiplier: 2,
    },
    {
      cost: 5E7,
      requirement: 100,
      multiplier: 2,
    },
    {
      cost: 5E9,
      requirement: 150,
      multiplier: 2,
    },
    {
      cost: 5E12,
      requirement: 200,
      multiplier: 2,
    },
    {
      cost: 5E15,
      requirement: 250,
      multiplier: 2,
    },
    {
      cost: 5E18,
      requirement: 300,
      multiplier: 2,
    },
    {
      cost: 5E21,
      requirement: 350,
      multiplier: 2,
    },
    {
      cost: 5E25,
      requirement: 400,
      multiplier: 2,
    },
    {
      cost: 5E29,
      requirement: 450,
      multiplier: 2,
    },
    {
      cost: 5E33,
      requirement: 500,
      multiplier: 2,
    },
    {
      cost: 5E43,
      requirement: 600,
      multiplier: 2,
    },
    {
      cost: 5E53,
      requirement: 700,
      multiplier: 2,
    },
    {
      cost: 5E63,
      requirement: 800,
      multiplier: 2,
    },
    {
      cost: 5E73,
      requirement: 900,
      multiplier: 2,
    },
    {
      cost: 5E83,
      requirement: 1000,
      multiplier: 2,
    },
  ],

  // job cooldown
  jobCooldown: [
    {
      cost: 1E3,
      cooldownReduction: 5,
    },
    {
      cost: 1E5,
      cooldownReduction: 5,
    },
    {
      cost: 1E7,
      cooldownReduction: 5,
    },
    {
      cost: 1E9,
      cooldownReduction: 5,
    },
    {
      cost: 1E11,
      cooldownReduction: 5,
    },
    {
      cost: 1E13,
      cooldownReduction: 5,
    },
    {
      cost: 1E15,
      cooldownReduction: 5,
    },
    {
      cost: 1E17,
      cooldownReduction: 5,
    },
    {
      cost: 1E19,
      cooldownReduction: 5,
    },
    {
      cost: 1E21,
      cooldownReduction: 5,
    },
    {
      cost: 1E23,
      cooldownReduction: 5,
    },
    {
      cost: 1E25,
      cooldownReduction: 4,
    },
  ],

  // urgent job cooldown
  urgentJobCooldown: [
    {
      cost: 5E6,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 5E9,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 5E12,
      cooldownMultiplier: 0.75,
    },
  ],
};
