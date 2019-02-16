import Vue from 'vue';
import Big from 'big.js';
import unixTimestamp from '@/utils/unixTimestamp';
import jobsData from '@/data/jobs';
import store from '@/store';

const state = Object.assign({}, jobsData());

const getters = {
  jobsComplete: () => store.state.statistics.stats.jobs,
};

const mutations = {
  setJobsData(s, { index, value }) {
    s[index] = value;
  },
  setJob(s, { id, job }) {
    Vue.set(s.jobs, id, job);
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
    Object.keys(s.jobsAvailableTimestamps).forEach((jobId) => {
      s.jobsAvailableTimestamps[jobId] += amount * 1000;
    });
  },
  resetJobTimer(s, jobId) {
    s.jobsCompletedTimestamps[jobId] = unixTimestamp();
    s.jobsAvailableTimestamps[jobId] = unixTimestamp(s.jobCooldown);
  },
  speedJobCooldown(s, id) {
    s.jobsAvailableTimestamps[id] -= store.state.rebirth.bonuses.hurryAmount * 1000;
    if (s.jobsAvailableTimestamps[id] < unixTimestamp()) {
      s.jobsAvailableTimestamps[id] = unixTimestamp();
    }
  },
  resetJobs(s) {
    const d = Object.assign({}, jobsData());
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
  fromJSON(s, obj) {
    Object.keys(obj).forEach((key) => {
      s[key] = obj[key];
    });
    s.jobRewardMultiplier = Big(s.jobRewardMultiplier);
    Object.keys(s.jobs).forEach((jobId) => {
      s.jobs[jobId].payment = Big(s.jobs[jobId].payment);
      s.jobs[jobId].words = Big(s.jobs[jobId].words);
    });
    s.urgentJobRewardMultiplier = Big(s.urgentJobRewardMultiplier);
    if (s.urgentJob) {
      s.urgentJob.payment = Big(s.urgentJob.payment);
      s.urgentJob.words = Big(s.urgentJob.words);
    }
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
