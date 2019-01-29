<template>
  <div class="jobs">
    <a
      class="button is-small is-primary"
      @click="newJobs()"
    >
      New Jobs (DEBUG)
    </a>
    <div class="jobs-header">
      Sell Your Writing
    </div>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 140px">
            Word Count
          </th>
          <th style="width: 400px">
            Job Name
          </th>
          <th style="width: 120px">
            Payment
          </th>
          <th style="width: 180px">
            Sell
          </th>
        </tr>
      </thead>
    </table>
    <div
      v-for="job in jobs"
      :key="job.id"
    >
      <table
        v-if="jobAvailable[job.id]"
        class="table"
      >
        <tbody>
          <tr>
            <td style="width: 140px">
              {{ job.words | round }}
            </td>
            <td style="width: 400px">
              {{ job.name }}
            </td>
            <td style="width: 120px">
              {{ job.payment | money }}
            </td>
            <td style="width: 180px">
              <a
                class="button is-small is-primary"
                :disabled="job.words.gt(words)"
                @click="completeJob(job.id)"
              >
                Sell Words
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-else
      >
        <div class="job-cooldown">
          <progress
            class="progress is-info"
            :value="jobTimer[job.id]"
            :max="jobCooldown * 1000"
          />
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
import Big from 'big.js';
import { mapState, mapGetters, mapMutations } from 'vuex';
import generateJobs from '@/utils/generateJobs';
import unixTimestamp from '@/utils/unixTimestamp';

export default {
  name: 'JobsGrid',
  data: () => ({
    jobAvailable: {
      0: true,
      1: true,
      2: true,
      3: true,
    },
    jobTimer: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    },
  }),
  computed: {
    ...mapState([
      'jobs',
      'jobCooldown',
      'jobRewardMultiplier',
      'jobsAvailableTimestamps',
      'jobsCompletedTimestamps',
      'nextJobTime',
      'workerWps',
    ]),
    ...mapGetters([
      'words',
      'wordValue',
    ]),
  },
  mounted() {
    if (Object.keys(this.jobs).length === 0) {
      this.newJobs();
    }
    setInterval(() => this.updateJobs(), 100);
  },
  methods: {
    newJobs() {
      this.updateData({ index: 'jobs', value: generateJobs(this.wordValue, this.workerWps) });
    },
    updateJobs() {
      for (let jobId = 0; jobId <= 3; jobId += 1) {
        this.jobAvailable[jobId] = unixTimestamp() >= this.jobsAvailableTimestamps[jobId];
        if (this.jobAvailable[jobId] && this.jobs[jobId].completed === true) {
          // TODO generate new job
        } else if (!this.jobAvailable[jobId]) {
          // update progress bar
          this.jobTimer[jobId] = (1000 * this.jobCooldown) - (this.jobsAvailableTimestamps[jobId] - unixTimestamp());
        }
      }
    },
    completeJob(id) {
      // get job
      const job = this.jobs[id];

      // check words
      if (this.words.lt(job.words)) {
        return;
      }

      // complete job
      this.$root.$emit('addMoney', this.jobRewardMultiplier.times(job.payment));
      this.$root.$emit('subtractWords', job.words);

      // show message
      this.$root.$emit('notify', 'Words Sold');

      // start cooldown
      this.resetJobTimer(job.id);

      // set as completed
      this.jobs[job.id].completed = true;
    },
    ...mapMutations([
      'resetJobTimer',
      'updateData',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.jobs {
  margin: 0 auto;
  width: 800px;
}
.jobs-header {
  font-size: 150%;
}
.job-cooldown {
  height: 43px;
  display:flex;
  align-items:center;
}
hr, .table, .progress {
  margin: 0;
}
</style>
