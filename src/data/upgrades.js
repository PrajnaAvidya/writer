export default {
  clicking: [
    {
      cost: 1E2,
      writingMultiplier: 2,
    },
    {
      cost: 1E3,
      writingMultiplier: 2,
    },
    {
      cost: 1E4,
      writingMultiplier: 2,
    },
    {
      cost: 1E5,
      writingMultiplier: 2,
    },
    {
      cost: 1E6,
      writingMultiplier: 2,
    },
    {
      cost: 1E7,
      writingMultiplier: 2,
    },
    {
      cost: 1E8,
      writingMultiplier: 2,
    },
  ],

  caffeine: [
    // length
    {
      cost: 1E2,
      lengthMultiplier: 1.25,
    },
    {
      cost: 1E3,
      lengthMultiplier: 1.25,
    },
    {
      cost: 1E4,
      lengthMultiplier: 1.25,
    },
    {
      cost: 1E5,
      lengthMultiplier: 1.25,
    },
    {
      cost: 1E6,
      lengthMultiplier: 1.25,
    },
    {
      cost: 1E7,
      lengthMultiplier: 1.25,
    },
    // cooldown reduction
    {
      cost: 1E2,
      cooldownReduction: 60,
    },
    {
      cost: 1E3,
      cooldownReduction: 60,
    },
    {
      cost: 1E4,
      cooldownReduction: 60,
    },
    {
      cost: 1E5,
      cooldownReduction: 60,
    },
    {
      cost: 1E6,
      cooldownReduction: 60,
    },
    {
      cost: 1E7,
      cooldownReduction: 60,
    },
    {
      cost: 1E8,
      cooldownReduction: 60,
    },
    {
      cost: 1E9,
      cooldownReduction: 60,
    },
    // power multiplier
    {
      cost: 1E2,
      powerMultiplier: 1.25,
    },
    {
      cost: 1E3,
      powerMultiplier: 1.25,
    },
    {
      cost: 1E4,
      powerMultiplier: 1.25,
    },
    {
      cost: 1E5,
      powerMultiplier: 1.25,
    },
    {
      cost: 1E6,
      powerMultiplier: 1.25,
    },
    {
      cost: 1E7,
      powerMultiplier: 1.25,
    },
    {
      cost: 1E8,
      powerMultiplier: 1.25,
    },
    {
      cost: 1E9,
      powerMultiplier: 1.25,
    },
    // word generation
    {
      cost: 5E2,
      wordMultiplier: 2,
    },
    {
      cost: 5E3,
      wordMultiplier: 2,
    },
    {
      cost: 5E4,
      wordMultiplier: 2,
    },
    {
      cost: 5E5,
      wordMultiplier: 2,
    },
    {
      cost: 5E6,
      wordMultiplier: 2,
    },
    {
      cost: 5E7,
      wordMultiplier: 2,
    },
    {
      cost: 5E8,
      wordMultiplier: 2,
    },
    {
      cost: 5E9,
      wordMultiplier: 2,
    },
  ],

  // costs are multiples of worker base cost
  genericWorker: [
    {
      cost: 5,
      requirement: 1,
      multiplier: 2,
    },
    {
      cost: 25,
      requirement: 5,
      multiplier: 2,
    },
    {
      cost: 50,
      requirement: 10,
      multiplier: 2,
    },
    {
      cost: 250,
      requirement: 15,
      multiplier: 2,
    },
    {
      cost: 500,
      requirement: 25,
      multiplier: 2,
    },
    {
      cost: 2500,
      requirement: 35,
      multiplier: 2,
    },
    {
      cost: 5000,
      requirement: 40,
      multiplier: 2,
    },
    {
      cost: 10000,
      requirement: 50,
      multiplier: 2,
    },
    {
      cost: 50000,
      requirement: 60,
      multiplier: 2,
    },
  ],

  // jobs
  jobs: [
    // cooldown reduction
    {
      cost: 1E2,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 1E3,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 1E4,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 1E5,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 1E6,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 1E7,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 1E8,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 1E9,
      cooldownMultiplier: 0.75,
    },
    {
      cost: 1E10,
      cooldownMultiplier: 0.75,
    },
    // reward multiplier
    {
      cost: 1E2,
      rewardMultiplier: 1.5,
    },
    {
      cost: 1E3,
      rewardMultiplier: 1.5,
    },
    {
      cost: 1E4,
      rewardMultiplier: 1.5,
    },
    {
      cost: 1E5,
      rewardMultiplier: 1.5,
    },
    {
      cost: 1E6,
      rewardMultiplier: 1.5,
    },
    {
      cost: 1E7,
      rewardMultiplier: 1.5,
    },
    {
      cost: 1E8,
      rewardMultiplier: 1.5,
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
    {
      cost: 5E5,
      rewardMultiplier: 2,
    },
    {
      cost: 5E8,
      rewardMultiplier: 2,
    },
    {
      cost: 5E11,
      rewardMultiplier: 2,
    },
  ],

  // word value
  wordValue: [
    {
      cost: 1E2,
      multiplier: 2,
    },
    {
      cost: 5E2,
      multiplier: 2,
    },
    {
      cost: 1E3,
      multiplier: 2,
    },
    {
      cost: 5E3,
      multiplier: 2,
    },
    {
      cost: 1E4,
      multiplier: 2,
    },
    {
      cost: 5E4,
      multiplier: 2,
    },
    {
      cost: 1E5,
      multiplier: 2,
    },
    {
      cost: 5E5,
      multiplier: 2,
    },
    {
      cost: 1E6,
      multiplier: 2,
    },
    {
      cost: 5E6,
      multiplier: 2,
    },
    {
      cost: 1E7,
      multiplier: 2,
    },
    {
      cost: 5E7,
      multiplier: 2,
    },
    {
      cost: 1E8,
      multiplier: 2,
    },
    {
      cost: 5E8,
      multiplier: 2,
    },
    {
      cost: 1E9,
      multiplier: 2,
    },
    {
      cost: 5E9,
      multiplier: 2,
    },
    {
      cost: 1E10,
      multiplier: 2,
    },
    {
      cost: 5E10,
      multiplier: 2,
    },
    {
      cost: 1E11,
      multiplier: 2,
    },
  ],
};
