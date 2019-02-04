<template>
  <div class="jobs">
    <div class="jobs-header">
      Writing Contracts
    </div>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 140px;">
            Word Count
          </th>
          <th style="width: 350px;">
            Job Name
          </th>
          <th style="width: 120px;">
            Payment
          </th>
          <th style="width: 230px;">
            Actions
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
            <td style="width: 350px">
              {{ job.name }}
            </td>
            <td style="width: 120px">
              {{ jobRewardMultiplier.times(job.payment) | money }}
            </td>
            <td style="width: 230px">
              <a
                class="button is-small is-primary is-tooltip-top"
                :class="{ 'tooltip': job.words.gt(words) }"
                :disabled="job.words.gt(words)"
                data-tooltip="Not enough words"
                @click="completeJob(job.id)"
              >
                Complete
              </a>
              &nbsp;
              <a
                v-if="firstJobComplete"
                class="button is-small"
                @click="declineJob(job.id)"
              >
                Decline
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-else
      >
        <div
          class="job-cooldown tooltip"
          :data-tooltip="`${jobTimer[job.id]}`"
          @click="hurryCooldown(job.id)"
        >
          <progress
            class="progress is-info"
            :value="jobProgress[job.id]"
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
          <td style="width: 350px">
            {{ urgentJob.name }} ({{ urgentJobCountdown }} seconds remaining)
          </td>
          <td style="width: 120px">
            {{ jobRewardMultiplier.times(urgentJobRewardMultiplier).times(urgentJob.payment) | money }}
          </td>
          <td style="width: 230px">
            <a
              class="button is-small is-primary is-tooltip-right"
              data-tooltip="Not enough words"
              :class="{ 'tooltip': urgentJob.words.gt(words) }"
              :disabled="urgentJob.words.gt(words)"
              @click="completeUrgentJob()"
            >
              Complete
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
import notify from '@/utils/notify';

export default {
  name: 'JobsGrid',
  data: () => ({
    jobProgress: {},
    jobTimer: {},
    interval: null,
  }),
  computed: {
    ...mapState([
      'jobs',
      'jobSlots',
      'jobCooldown',
      'jobRewardMultiplier',
      'jobsAvailableTimestamps',
      'jobsCompletedTimestamps',
      'firstJobComplete',
      'nextJobTime',
      'jobAvailable',
      'workerWps',
      'urgentJob',
      'urgentJobActive',
      'urgentJobCountdown',
      'urgentJobRewardMultiplier',
      'debugMode',
    ]),
    ...mapGetters([
      'words',
      'wordValue',
    ]),
  },
  mounted() {
    // only run once
    this.interval = setInterval(() => this.updateProgressBars(), 100);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    updateProgressBars() {
      for (let jobId = 1; jobId <= this.jobSlots; jobId += 1) {
        if (!this.jobAvailable[jobId]) {
          this.$set(this.jobProgress, jobId, (1000 * this.jobCooldown) - (this.jobsAvailableTimestamps[jobId] - unixTimestamp()));
          this.$set(this.jobTimer, jobId, `${parseInt((this.jobsAvailableTimestamps[jobId] - unixTimestamp()) / 1000, 10)} seconds until new job`);
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
      this.updateData({ index: 'firstJobComplete', value: true });

      // show message
      notify(`Job Complete: ${job.name}`, { icon: 'fa-briefcase' });

      // set as completed
      this.jobs[job.id].completed = true;

      // start cooldown
      this.resetJobTimer(job.id);
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
      this.updateData({ index: 'firstUrgentJobComplete', value: true });

      // show message
      notify(`Urgent Job Complete: ${job.name}`, { icon: 'fa-bullhorn' });

      // reset urgent job
      this.$root.$emit('setNextUrgentJob');
    },
    declineJob(id) {
      // mark as completed so it will regen
      this.jobs[id].completed = true;

      // start cooldown
      this.resetJobTimer(id);

      // show message
      notify(`Job Declined: ${this.jobs[id].name}`, { icon: 'fa-times' });
    },
    hurryCooldown(id) {
      this.speedJobCooldown({ id, seconds: 1 });
    },
    ...mapMutations([
      'resetJobTimer',
      'updateData',
      'addToStat',
      'speedJobCooldown',
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
  padding-left: 20px;
  padding-right: 20px;
  height: 43px;
  display:flex;
  align-items:center;
  background-color: $greenish;
}
hr, .table, .progress {
  margin: 0;
}
.urgent {
  background-color: $red;
}
</style>
