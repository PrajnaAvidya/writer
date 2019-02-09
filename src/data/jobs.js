import Big from 'big.js';

const data = {
  // regular jobs
  maxJobSlots: 5,
  jobs: {}, // TODO grep 'jobs'
  jobsCompletedTimestamps: {}, // TODO
  jobsAvailableTimestamps: {},
  jobCooldown: 60,
  jobRewardMultiplier: Big(1),
  jobAvailable: {},

  // urgent jobs
  urgentJob: null,
  urgentJobActive: false,
  urgentJobTimestamp: null,
  urgentJobExpiration: null,
  urgentJobMinimumTime: 300,
  urgentJobMaximumTime: 900,
  urgentJobTimer: 60,
  urgentJobCountdown: 0,
  urgentJobRewardMultiplier: Big(1),
};

export default function () {
  const jobsData = Object.assign({}, data);

  for (let id = 1; id <= jobsData.maxJobSlots; id += 1) {
    jobsData.jobsCompletedTimestamps[id] = 0;
    jobsData.jobsAvailableTimestamps[id] = 0;
  }

  return jobsData;
}
