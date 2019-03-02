export default [
  // job slots
  {
    name: 'Second Job Slot',
    description: 'Unlocks another job slot',
    cost: 25,
    type: 'jobSlot',
  },
  {
    name: 'Third Job Slot',
    description: 'Unlocks another job slot',
    cost: 75,
    type: 'jobSlot',
  },
  {
    name: 'Fourth Job Slot',
    description: 'Unlocks yet another job slot',
    cost: 150,
    type: 'jobSlot',
  },
  {
    name: 'Fifth Job Slot',
    description: 'Unlocks the final job slot!',
    cost: 300,
    type: 'jobSlot',
  },
  // cooldowns
  {
    name: 'Hurry Cooldowns',
    description: 'Increase effectiveness of clicking job/caffeine cooldown bars',
    cost: 100,
    type: 'hurryAmount',
  },
  {
    name: 'HURRY, COOLDOWNS!',
    description: 'Increase effectiveness of clicking job/caffeine cooldown bars even more',
    cost: 200,
    type: 'hurryAmount',
  },
  // passive $
  {
    name: 'Easy Money',
    description: 'Recieve 1 cent for every word generated (includes job reward multiplier)',
    cost: 100,
    type: 'passiveMoney',
  },
  {
    name: 'EZ Money',
    description: 'Doubles passive money generation',
    cost: 200,
    type: 'passiveMoney',
  },
  {
    name: 'Ballin\'',
    description: 'Doubles passive money generation',
    cost: 300,
    type: 'passiveMoney',
  },
  {
    name: 'Rich Kid',
    description: 'Doubles passive money generation',
    cost: 400,
    type: 'passiveMoney',
  },
  {
    name: 'Plutocracy',
    description: 'Doubles passive money generation',
    cost: 500,
    type: 'passiveMoney',
  },
  // caffeine wps
  {
    name: 'Cappuccino',
    description: 'Permanently doubles the word generating effect of caffeine',
    cost: 100,
    type: 'caffeineWordMultiplier',
  },
  {
    name: 'Espresso',
    description: 'Permanently doubles the word generating effect of caffeine',
    cost: 200,
    type: 'caffeineWordMultiplier',
  },
  {
    name: 'Latte',
    description: 'Permanently doubles the word generating effect of caffeine',
    cost: 300,
    type: 'caffeineWordMultiplier',
  },
  {
    name: 'Mocha',
    description: 'Permanently doubles the word generating effect of caffeine',
    cost: 400,
    type: 'caffeineWordMultiplier',
  },
  {
    name: 'Ristretto',
    description: 'Permanently doubles the word generating effect of caffeine',
    cost: 500,
    type: 'caffeineWordMultiplier',
  },
  // rebirth $
  {
    name: 'Pay It Forward',
    description: 'Start with $1,000 when rebirthing',
    cost: 50,
    type: 'rebirthMoney',
    amount: 1000,
  },
  {
    name: 'Dividends',
    description: 'Start with $10,000 when rebirthing',
    cost: 100,
    type: 'rebirthMoney',
    amount: 10000,
  },
  {
    name: '401k',
    description: 'Start with $100,000 when rebirthing',
    cost: 250,
    type: 'rebirthMoney',
    amount: 100000,
  },
  {
    name: 'Trust Fund',
    description: 'Start with $1,000,000 when rebirthing',
    cost: 500,
    type: 'rebirthMoney',
    amount: 1E6,
  },
  {
    name: '0.01%',
    description: 'Start with $1,000,000,000 when rebirthing',
    cost: 1000,
    type: 'rebirthMoney',
    amount: 1E9,
  },
  // job words
  {
    name: 'Clocking Out Early',
    description: 'Jobs require 20% fewer words to complete (but pay the same)',
    cost: 100,
    type: 'jobWords',
  },
  {
    name: 'Habitually Lazy',
    description: 'Jobs require 20% fewer words to complete (but pay the same)',
    cost: 200,
    type: 'jobWords',
  },
  {
    name: 'Absentee',
    description: 'Jobs require 20% fewer words to complete (but pay the same)',
    cost: 300,
    type: 'jobWords',
  },
  {
    name: 'Failing Upward',
    description: 'Jobs require 20% fewer words to complete (but pay the same)',
    cost: 400,
    type: 'jobWords',
  },
  {
    name: 'Peter Principle',
    description: 'Jobs require 20% fewer words to complete (but pay the same)',
    cost: 500,
    type: 'jobWords',
  },
];
