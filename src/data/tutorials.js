// conditions/data for tutorial modals & unfolding

export default [
  {
    unlock: {
      words: 5,
    },
    delay: 10,
    text: 'I didn\'t realize this would be SO HARD. It\'s taking forever just to write a few words! Maybe drinking a coffee would help...',
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
      words: 1,
    },
    delay: 30,
    text: 'Woah that felt <i>GOOD</i> and made me write much faster! Now that I\'ve written some words maybe I can sell them at the writing agency down the street...',
    reveal: ['showNavigation', 'showJobs'],
  },
  {
    unlock: {
      job: true,
    },
    delay: 5,
    text: 'A nice infusion of cash! Now that I\'m making money selling my writing I can hire some workers to write for me. I wonder if there\'s a way to make a new job available faster?',
    reveal: ['showMoney', 'showWorkers'],
  },
  {
    unlock: {
      worker: true,
    },
    delay: 5,
    text: 'This is so much easier than writing words myself! The more workers I hire, the more money I can make.',
  },
  {
    unlock: {
      words: 100,
    },
    delay: 10,
    text: 'Someone really needs to get a job done and is offering a bunch of extra cash for it. I should watch out for these opportunities.',
    urgentJob: true,
  },
  {
    unlock: {
      money: 1,
    },
    delay: 5,
    text: 'Sweet! I can use this money to buy some upgrades, or hire more workers... or both!',
    reveal: ['showUpgrades', 'showStats'],
  },
];
