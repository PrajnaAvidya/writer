export default {
  clicking: [
    {
      cost: 1E2,
      writingMultiplier: 2,
    },
    {
      cost: 5E2,
      writingMultiplier: 2,
    },
    {
      cost: 1E3,
      writingMultiplier: 2,
    },
    {
      cost: 5E3,
      writingMultiplier: 2,
    },
    {
      cost: 1E4,
      writingMultiplier: 2,
    },
    {
      cost: 5E4,
      writingMultiplier: 2,
    },
    {
      cost: 1E5,
      writingMultiplier: 2,
    },
    {
      cost: 5E5,
      writingMultiplier: 2,
    },
    {
      cost: 1E6,
      writingMultiplier: 2,
    },
    {
      cost: 5E6,
      writingMultiplier: 2,
    },
    {
      cost: 1E7,
      writingMultiplier: 2,
    },
    {
      cost: 5E7,
      writingMultiplier: 2,
    },
    {
      cost: 1E8,
      writingMultiplier: 2,
    },
    {
      cost: 5E8,
      writingMultiplier: 2,
    },
    {
      cost: 1E9,
      writingMultiplier: 2,
    },
  ],

  caffeine: [
    // length
    {
      cost: 1E2,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E3,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E4,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E5,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E6,
      lengthMultiplier: 1.5,
    },
    {
      cost: 1E7,
      lengthMultiplier: 1.5,
    },
    // cooldown reduction
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
    // power multiplier
    {
      cost: 1E2,
      powerMultiplier: 1.5,
    },
    {
      cost: 1E3,
      powerMultiplier: 1.5,
    },
    {
      cost: 1E4,
      powerMultiplier: 1.5,
    },
    {
      cost: 1E5,
      powerMultiplier: 1.5,
    },
    {
      cost: 1E6,
      powerMultiplier: 1.5,
    },
    {
      cost: 1E7,
      powerMultiplier: 1.5,
    },
    {
      cost: 1E8,
      powerMultiplier: 1.5,
    },
    {
      cost: 1E9,
      powerMultiplier: 1.5,
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
    {
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
    {
      cost: 5E24,
      requirement: 400,
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
