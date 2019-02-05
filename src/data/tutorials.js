// conditions/data for tutorial modals

export default [
  {
    unlock: {
      words: 10,
    },
    delay: 10,
    text: 'I didn\'t realize this would be SO HARD. It\'s taking forever just to write a few words! Maybe drinking a coffee would help...',
    reveal: ['showCoffee'],
  },
  {
    unlock: {
      caffeine: true,
    },
    delay: 30,
    text: 'Woah that felt <i>GOOD</i> and made me write much faster! Now that I\'ve written some words maybe I can sell them at the writing agency down the street...',
    reveal: ['showJobs', 'showWps', 'showNavigation'],
  },
  {
    unlock: {
      job: true,
    },
    delay: 5,
    text: 'A nice infusion of cash! Now that I\'m making money selling my writing I can hire some workers to write for me.',
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
      money: 50,
    },
    reveal: ['showUpgrades', 'showStats'],
  },
];
