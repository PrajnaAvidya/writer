<template>
  <div class="jobs">
    <div class="jobs-header">
      Writing Contracts
    </div>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 120px;">
            Payment
          </th>
          <th style="width: 350px;">
            Job Name
          </th>
          <th style="width: 140px;">
            Word Count
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
            <td style="width: 120px">
              {{ jobRewardMultiplier.times(job.currentPayment) | money }}
            </td>
            <td style="width: 350px">
              {{ job.name }}
            </td>
            <td style="width: 140px">
              {{ job.words | round }}
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
                v-if="checkUnfolding('firstJobComplete')"
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
          <span class="job-current-payment">
            {{ jobRewardMultiplier.times(job.currentPayment) | money }}
          </span>
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
          <td style="width: 120px">
            {{ jobRewardMultiplier.times(urgentJobRewardMultiplier).times(urgentJob.payment) | money }}
          </td>
          <td style="width: 350px">
            {{ urgentJob.name }} ({{ urgentJobCountdown }} seconds remaining)
          </td>
          <td style="width: 140px">
            {{ urgentJob.words | round }}
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
import unixTimestamp from '@/utils/unixTimestamp';
import notify from '@/utils/notify';

export default {
  name: 'JobsGrid',
  data: () => ({
    jobProgress: {},
    jobTimer: {},
    interval: null,
    completingJob: {},
  }),
  computed: {
    ...mapState('currency', [
      'words',
      'wordValue',
    ]),
    ...mapState('jobs', [
      'jobs',
      'jobCooldown',
      'jobRewardMultiplier',
      'jobsAvailableTimestamps',
      'jobsCompletedTimestamps',
      'nextJobTime',
      'jobAvailable',
      'urgentJob',
      'urgentJobActive',
      'urgentJobCountdown',
      'urgentJobRewardMultiplier',
    ]),
    ...mapGetters('unfolding', [
      'checkUnfolding',
    ]),
    ...mapGetters('rebirth', [
      'jobSlots',
    ]),
  },
  mounted() {
    // only run once
    this.interval = setInterval(() => this.updateJobStatuses(), 100);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    updateJobStatuses() {
      const uTimestamp = unixTimestamp();
      for (let jobId = 1; jobId <= this.jobSlots; jobId += 1) {
        if (!this.jobAvailable[jobId]) {
          // update bars
          this.$set(this.jobProgress, jobId, (1000 * this.jobCooldown) - (this.jobsAvailableTimestamps[jobId] - uTimestamp));
          this.$set(this.jobTimer, jobId, `${parseInt((this.jobsAvailableTimestamps[jobId] - uTimestamp) / 1000, 10)} seconds until new job`);
          // set currentPayment
          let currentPayment = this.jobs[jobId].payment.plus(Big((uTimestamp - this.jobsCompletedTimestamps[jobId]) / 1000).div(this.jobCooldown).times(this.jobs[jobId].payment)).div(2);
          if (currentPayment.gt(this.jobs[jobId].payment)) {
            currentPayment = Big(this.jobs[jobId].payment);
          }
          this.jobs[jobId].currentPayment = currentPayment;
        } else {
          this.$set(this.jobProgress, jobId, 0);
        }
      }
    },
    completeJob(id) {
      // check/start cooldown timer
      if (this.completingJob[id]) {
        return;
      }
      this.completingJob[id] = true;
      setTimeout(() => {
        this.completingJob[id] = false;
      }, 1000);

      // get job
      const job = this.jobs[id];

      // check words
      if (this.words.lt(job.words)) {
        return;
      }

      // complete job
      this.$root.$emit('addMoney', this.jobRewardMultiplier.times(job.currentPayment));
      this.$root.$emit('subtractWords', job.words);
      this.addToStat({ stat: 'jobs', amount: 1 });
      this.revealUnfolding('firstJobComplete');

      // show message
      notify(`Job Complete: ${job.name}`, { icon: 'fa-briefcase' });

      // set as completed
      this.jobs[job.id].completed = true;

      // start cooldown
      this.resetJobTimer(job.id);

      this.$ga.event({
        eventCategory: 'Job',
        eventAction: 'Completed',
        eventLabel: `${job.name} ${this.jobRewardMultiplier.times(job.currentPayment).toString()}`,
      });
    },
    completeUrgentJob() {
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
      this.revealUnfolding('firstUrgentJob');

      // show message
      notify(`Job Complete: ${job.name}`, { icon: 'fa-bullhorn' });

      // reset urgent job
      this.$root.$emit('setNextUrgentJob');

      this.$ga.event({
        eventCategory: 'Urgent Job',
        eventAction: 'Completed',
        eventLabel: `${job.name} ${this.urgentJobRewardMultiplier.times(job.payment).toString()}`,
      });
    },
    declineJob(id) {
      // get job
      const job = this.jobs[id];

      // mark as completed so it will regen
      this.jobs[id].completed = true;

      // start cooldown
      this.resetJobTimer(id);

      // show message
      notify(`Job Declined: ${this.jobs[id].name}`, { icon: 'fa-times' });

      this.$ga.event({
        eventCategory: 'Job',
        eventAction: 'Declined',
        eventLabel: `${job.name} ${this.urgentJobRewardMultiplier.times(job.currentPayment).toString()}`,
      });
    },
    hurryCooldown(id) {
      this.speedJobCooldown(id);
    },
    ...mapMutations('unfolding', [
      'revealUnfolding',
    ]),
    ...mapMutations('statistics', [
      'addToStat',
    ]),
    ...mapMutations('jobs', [
      'resetJobTimer',
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
  font-size: 18pt;
  margin-bottom: 5px;
}
.job-cooldown {
  cursor: pointer;
  padding-left: 12px;
  padding-right: 20px;
  height: 43px;
  display: flex;
  align-items: center;
  background-color: $greenish;
}
.job-current-payment {
  text-align: left;
  width: 140px;
  padding-bottom: 3px;
  font-weight: 400;
  color: #363636;
}
hr, .table, .progress {
  margin: 0;
}
.urgent {
  background-color: $red;
}
</style>
