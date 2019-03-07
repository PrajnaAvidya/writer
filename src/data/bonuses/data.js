export default [
  // managers
  {
    name: 'Management',
    description: '<strong>NEW MECHANIC:</strong> Managers will hire workers automatically!',
    cost: 400,
    type: 'managers',
  },
  {
    name: 'Middle Management',
    description: 'Managers hire workers every 5 seconds',
    cost: 600,
    type: 'managers',
  },
  {
    name: 'Upper Management',
    description: 'Managers hire workers every 2 seconds',
    cost: 800,
    type: 'managers',
  },
  {
    name: 'Executives',
    description: 'Managers hire workers every second',
    cost: 1200,
    type: 'managers',
  },
  {
    name: 'Organic Growth',
    description: 'Managers hire 2 workers at once',
    cost: 500,
    type: 'managerWorkers',
    unfoldingCondition: 'showManagers',
  },
  {
    name: 'Corporate Synergy',
    description: 'Managers hire 5 workers at once',
    cost: 750,
    type: 'managerWorkers',
  },
  {
    name: 'Paradigm Shift',
    description: 'Managers hire 10 workers at once',
    cost: 1000,
    type: 'managerWorkers',
  },
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
  // buy all upgrades
  {
    name: 'Unpaid Intern',
    description: 'Unlock "Buy All" button for upgrades',
    cost: 50,
    type: 'buyAllUpgrades',
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
  // auto caffeine
  {
    name: 'Insomniac',
    description: 'Automatically drink Coffee when available',
    cost: 150,
    type: 'autoCaffeine',
  },
];
