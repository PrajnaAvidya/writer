import Big from 'big.js';
import milestones from '@/data/milestones';

const stats = {
  words: 'Words Written',
  clickWords: 'Words Written from Clicks',
  money: 'Money Made',
  moneySpent: 'Money Spent',
  caffeines: 'Coffees Drank',
  workers: 'Workers Hired',
  jobs: 'Jobs Complete',
  urgentJobs: 'Urgent Jobs Complete',
  upgrades: 'Upgrades Bought',
  clickables: 'Books Clicked',
  wps: 'Highest Words Per Second',
};

export default function () {
  const statistics = {};

  // generate stats
  statistics.stats = {};
  statistics.statDescriptions = {};
  Object.keys(stats).forEach((stat) => {
    statistics.stats[stat] = Big(0);
    statistics.statDescriptions[stat] = stats[stat];
  });

  // generate first set of milestones
  statistics.milestoneTargets = {};
  statistics.milestoneCount = {};
  Object.keys(milestones).forEach((stat) => {
    statistics.milestoneTargets[stat] = Big(milestones[stat].base);
    statistics.milestoneCount[stat] = 0;
  });

  return statistics;
}
