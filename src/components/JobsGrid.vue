<template>
  <div class="jobs">
    <a
      class="button is-small is-primary"
      @click="newJobs()"
    >
      New Jobs (DEBUG)
    </a>
    <div class="jobs-header">
      Writing Contracts
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
              {{ jobRewardMultiplier.times(job.payment) | money }}
            </td>
            <td style="width: 180px">
              <a
                class="button is-small is-primary"
                :disabled="job.words.gt(words)"
                @click="completeJob(job.id)"
              >
                Take Job
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
    <table
      v-if="urgentJobActive"
      class="table"
    >
      <tbody>
        <tr class="urgent">
          <td style="width: 140px">
            {{ urgentJob.words | round }}
          </td>
          <td style="width: 400px">
            {{ urgentJob.name }} ({{ urgentJobCountdown }} seconds remaining)
          </td>
          <td style="width: 120px">
            {{ jobRewardMultiplier.times(urgentJobRewardMultiplier).times(urgentJob.payment) | money }}
          </td>
          <td style="width: 180px">
            <a
              class="button is-small is-primary"
              :disabled="urgentJob.words.gt(words)"
              @click="completeUrgentJob()"
            >
              Sell Words
            </a>
          </td>
        </tr>
      </tbody>
    </table>
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
      1: true,
      2: true,
      3: true,
      4: true,
    },
    jobTimer: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
    interval: null,
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
      'urgentJob',
      'urgentJobActive',
      'urgentJobCountdown',
      'urgentJobRewardMultiplier',
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
    // only run once
    this.interval = setInterval(() => this.updateJobs(), 100);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    newJobs() {
      this.updateData({ index: 'jobs', value: generateJobs(this.wordValue, this.workerWps) });
      this.jobsAvailableTimestamps[1] = unixTimestamp();
      this.jobsAvailableTimestamps[2] = unixTimestamp();
      this.jobsAvailableTimestamps[3] = unixTimestamp();
      this.jobsAvailableTimestamps[4] = unixTimestamp();
    },
    updateJobs() {
      for (let jobId = 1; jobId <= 4; jobId += 1) {
        this.jobAvailable[jobId] = unixTimestamp() >= this.jobsAvailableTimestamps[jobId];
        if (this.jobAvailable[jobId]) {
          if (this.jobs[jobId].completed === true) {
            // generate new job
            this.jobs[jobId] = generateJobs(this.wordValue, this.workerWps, jobId);
          } else if (unixTimestamp() >= this.jobsAvailableTimestamps[jobId] + (this.jobCooldown * 1000)) {
            // regenerate stale job
            this.jobs[jobId] = generateJobs(this.wordValue, this.workerWps, jobId);
            this.jobsAvailableTimestamps[jobId] = unixTimestamp();
          }
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
      this.$root.$emit('notify', 'Job Complete');

      // start cooldown
      this.resetJobTimer(job.id);

      // set as completed
      this.jobs[job.id].completed = true;
    },
    completeUrgentJob(id) {
      // get job
      const job = this.urgentJob;

      // check words
      if (this.words.lt(job.words)) {
        return;
      }

      // complete job
      this.$root.$emit('addMoney', this.jobRewardMultiplier.times(this.urgentJobRewardMultiplier).times(job.payment));
      this.$root.$emit('subtractWords', job.words);
      this.addToStat({ stat: 'urgentJobs', amount: 1 });

      // show message
      this.$root.$emit('notify', 'Urgent Job Complete');

      // reset urgent job
      this.$root.$emit('setNextUrgentJob');
    },
    ...mapMutations([
      'resetJobTimer',
      'updateData',
      'addToStat',
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
.urgent {
  background-color: #DE636F;
}
</style>
