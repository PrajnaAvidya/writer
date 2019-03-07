export default [
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
    name: 'Upper Management',
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
];
