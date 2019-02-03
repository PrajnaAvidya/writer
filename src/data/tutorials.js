// conditions/data for tutorial modals

export default [
  {
    unlock: {
      words: 10,
    },
    delay: 30,
    text: 'I didn\'t realize this would be SO HARD. It\'s taking forever just to write a few words! Maybe drinking a coffee would help...',
    // TODO reveal/highlight caffeine
  },
  {
    unlock: {
      caffeine: true,
    },
    delay: 60,
    text: 'Woah that feels <i>GOOD</i> and makes me write much faster! Now that I\'ve written some words maybe I can sell them at the writing agency down the street...',
    // TODO reveal/highlight jobs
  },
  {
    unlock: {
      job: true,
    },
    delay: 5,
    text: 'A nice infusion of cash! Now that I\'m making money selling my writing I can hire some workers to write for me.',
    // TODO reveal/highlight workers
  },
  {
    unlock: {
      worker: true,
    },
    delay: 60,
    text: 'This is so much easier than writing words myself! The more workers I hire, the more money I can make.',
    // TODO trigger urgent job
  },
  // TODO introduce urgent jobs
  // TODO introduce upgrades
];
