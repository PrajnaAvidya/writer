<template>
  <div class="jobs">
    <article
      class="message is-success"
      :class="{ 'is-hidden': !showMessage }"
    >
      <div class="message-header">
        <p>{{ messageTitle }}</p>
        <button
          class="delete"
          aria-label="delete"
          @click="showMessage = false"
        />
      </div>
      <div class="message-body">
        {{ currentMessage }}
      </div>
    </article>

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
            <th style="width: 120px">
              Word Count
            </th>
            <th style="width: 400px">
              Job Name
            </th>
            <th style="width: 120px">
              Payment
            </th>
            <th style="width: 200px">
              Sell
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in exampleJobs"
            :key="job.id"
          >
            <td>{{ job.wordCount | round }}</td>
            <td>{{ job.name }}</td>
            <td>{{ job.payment | money }}</td>
            <td>
              <a
                class="button is-small is-primary"
                :disabled="job.wordCount.gt(words)"
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
import unixTimestamp from '@/utils/unixTimestamp';

export default {
  name: 'JobsGrid',
  data: () => ({
    showMessage: false,
    jobAvailableTimer: -1,
    messageTitle: '',
    currentMessage: '',
    exampleJobs: {
      1: { id: 1, wordCount: Big(200), name: 'Blurb', payment: Big(5) },
      2: { id: 2, wordCount: Big(500), name: 'Op-Ed', payment: Big(15) },
      3: { id: 3, wordCount: Big(1000), name: 'Editorial', payment: Big(32) },
    },
  }),
  computed: {
    ...mapState([
      'jobCooldown',
      'jobRewardMultiplier',
      'nextJobTime',
    ]),
    ...mapGetters([
      'words',
    ]),
  },
  mounted() {
    // this.exampleJobs = generateJobs();
    setInterval(() => this.updateTimer(), 250);
  },
  methods: {
    updateTimer() {
      this.jobAvailableTimer = parseInt(this.nextJobTime - unixTimestamp(), 10);
    },
    completeJob(id) {
      const job = this.exampleJobs[id];

      if (this.words.lt(job.wordCount)) {
        return;
      }

      this.messageTitle = 'Success';
      this.currentMessage = 'Job Finished';
      this.showMessage = true;

      this.$root.$emit('addMoney', this.jobRewardMultiplier.times(job.payment));

      // subtract words
      this.$root.$emit('subtractWords', job.wordCount);

      // start jobs cooldown
      this.resetJobTimer(this.jobCooldown);
      this.jobAvailableTimer = parseInt(this.nextJobTime - unixTimestamp(), 10);
    },
    ...mapMutations([
      'resetJobTimer',
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
