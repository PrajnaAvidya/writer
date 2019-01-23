export default {
  clicking: [
    {
      cost: 1000,
      ideaMultiplier: 2,
    },
    {
      cost: 1000,
      writingMultiplier: 2,
    },
    {
      cost: 10000,
      maxWritingMultiplier: 2,
    },
    {
      cost: 100000,
      ideaMultiplier: 2,
    },
    {
      cost: 100000,
      writingMultiplier: 2,
    },
    {
      cost: 1000000,
      maxWritingMultiplier: 2,
    },
    {
      cost: 1E8,
      ideaMultiplier: 2,
    },
    {
      cost: 1E8,
      writingMultiplier: 2,
    },
    {
      cost: 1E9,
      maxWritingMultiplier: 2,
    },
  ],

  caffeine: [
    {
      cost: 100,
      caffeineLengthMultiplier: 2,
    },
    {
      cost: 10000,
      caffeineLengthMultiplier: 2,
    },
    {
      cost: 1000000,
      caffeineLengthMultiplier: 2,
    },
    {
      cost: 1000,
      caffeineMaxLengthAdder: 300,
    },
    {
      cost: 10000,
      caffeineMaxLengthAdder: 300,
    },
    {
      cost: 100000,
      caffeineMaxLengthAdder: 300,
    },
    {
      cost: 10000,
      caffeinePowerMultiplier: 2,
    },
    {
      cost: 1E6,
      caffeinePowerMultiplier: 2,
    },
    {
      cost: 1E8,
      caffeinePowerMultiplier: 2,
    },
  ],

  // costs are multiples of worker base cost
  genericWorker: [
    {
      cost: 10,
      requirement: 1,
      productivityMultiplier: 2,
    },
    {
      cost: 25,
      requirement: 5,
      efficiencyMultiplier: 2,
    },
    {
      cost: 100,
      requirement: 10,
      productivityMultiplier: 2,
    },
    {
      cost: 200,
      requirement: 15,
      efficiencyMultiplier: 2,
    },
    {
      cost: 500,
      requirement: 25,
      productivityMultiplier: 2,
    },
    {
      cost: 2000,
      requirement: 35,
      efficiencyMultiplier: 2,
    },
    {
      cost: 5000,
      requirement: 40,
      productivityMultiplier: 2,
    },
  ],
};
