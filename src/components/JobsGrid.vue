<template>
  <div class="jobs">
    <a
      class="button is-small is-primary"
      @click="newJobs()"
    >
      New Jobs
    </a>
    <div
      v-if="jobAvailableTimer <= 0"
      class="jobs-table"
    >
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
        <tbody>
          <tr
            v-for="job in jobs"
            :key="job.id"
          >
            <td>{{ job.words | round }}</td>
            <td>{{ job.name }}</td>
            <td>{{ job.payment | money }}</td>
            <td>
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
    </div>

    <div v-else>
      <div class="jobs-header">
        New job available in {{ jobAvailableTimer }} seconds
      </div>
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
    jobAvailableTimer: -1,
  }),
  computed: {
    ...mapState([
      'jobs',
      'jobCooldown',
      'jobRewardMultiplier',
      'jobsGenerated',
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
    setInterval(() => this.updateTimer(), 250);
  },
  methods: {
    newJobs() {
      this.updateData({ index: 'jobs', value: generateJobs(this.wordValue, this.workerWps) });
    },
    updateTimer() {
      this.jobAvailableTimer = parseInt((this.nextJobTime - unixTimestamp()) / 1000, 10);
      if (this.jobAvailableTimer <= 0 && !this.jobsGenerated) {
        this.newJobs();
        this.setJobsGenerated(true);
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
      this.$root.$emit('notify', {
        text: 'Words Sold',
        type: 'success',
        timeout: 5000,
      });

      // start cooldown
      this.resetJobTimer(this.jobCooldown);
      this.jobAvailableTimer = parseInt((this.nextJobTime - unixTimestamp()) / 1000, 10);
      this.setJobsGenerated(false);
    },
    ...mapMutations([
      'resetJobTimer',
      'updateData',
      'setJobsGenerated',
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
</style>
