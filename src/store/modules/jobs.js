import unixTimestamp from '@/utils/unixTimestamp';
import jobsData from '@/data/jobs';
import store from '@/store';

const state = jobsData;

const getters = {
  jobsComplete: () => store.state.game.statistics.jobs,
};

const mutations = {
  setJobsData(s, { index, value }) {
    s[index] = value;
  },
  multiplyJobData(s, { index, amount }) {
    if (typeof s[index] === 'object') {
      s[index] = s[index].times(amount);
    } else {
      s[index] *= amount;
    }
  },
  adjustJobTimer(s, amount) {
    s.jobCooldown += amount;
    Object.keys(s.jobAvailable).forEach((jobId) => {
      s.jobAvailable[jobId] += amount * 1000;
    });
  },
  resetJobTimer(s, jobId) {
    s.jobsCompletedTimestamps[jobId] = unixTimestamp();
    s.jobsAvailableTimestamps[jobId] = unixTimestamp(s.jobCooldown);
  },
  speedJobCooldown(s, id) {
    s.jobsAvailableTimestamps[id] -= store.state.rebirth.bonuses.hurryAmount * 1000;
  },
  resetJobs(s) {
    const d = jobsData();
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
    console.log(s);
  },
};

const actions = {
  //
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
