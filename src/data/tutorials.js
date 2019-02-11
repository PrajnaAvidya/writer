// conditions/data for tutorial modals & unfolding

const tutorials = [
  {
    unlock: {
      words: 5,
    },
    delay: 5,
    reveal: ['showCoffee'],
  },
  {
    unlock: {
      caffeine: true,
    },
    reveal: ['showWps'],
  },
  {
    unlock: {
      words: 50,
    },
    reveal: ['showNavigation', 'showJobs'],
  },
  {
    unlock: {
      job: true,
    },
    reveal: ['showMoney', 'showWorkers'],
  },
  {
    unlock: {
      words: 200,
    },
    urgentJob: true,
    reveal: ['showStats'],
  },
  {
    unlock: {
      money: 100,
    },
    reveal: ['showUpgrades'],
  },
];

export default function () {
  const data = {};

  data.tutorials = tutorials.reverse();
  data.currentTutorial = null;

  return data;
}
