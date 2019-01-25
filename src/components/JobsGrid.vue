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
      v-if="jobActive"
      class="jobs-table"
    >
      <div class="jobs-header">
        Available Jobs
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
              Complete
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in exampleJobs"
            :key="job.index"
          >
            <td>{{ job.wordCount | round }}</td>
            <td>{{ job.name }}</td>
            <td>{{ job.payment | money }}</td>
            <td>
              <a
                class="button is-small is-primary"
                :disabled="job.wordCount.gt(words)"
                @click="completeJob(job.index)"
              >
                Complete Job
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
import { mapState, mapMutations } from 'vuex';
import unixTimestamp from '@/utils/unixTimestamp';

export default {
  name: 'JobsGrid',
  props: {
    words: {
      type: Object,
      required: true,
    },
    jobCooldown: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    showMessage: false,
    jobAvailableTimer: -1,
    messageTitle: '',
    currentMessage: '',
    exampleJobs: [
      { index: 0, wordCount: Big(200), name: 'Blurb', payment: Big(5) },
      { index: 1, wordCount: Big(500), name: 'Op-Ed', payment: Big(15) },
      { index: 2, wordCount: Big(1000), name: 'Editorial', payment: Big(32) },
    ],
  }),
  computed: {
    ...mapState([
      'jobActive',
      'nextJobTime',
    ]),
  },
  mounted() {
    setInterval(() => this.updateTimer(), 1000);
  },
  methods: {
    updateTimer() {
      this.jobAvailableTimer = parseInt(this.nextJobTime - unixTimestamp(), 10);
    },
    completeJob(index) {
      const job = this.exampleJobs[index];

      if (this.words.lt(job.wordCount)) {
        return;
      }

      this.messageTitle = 'Success';
      this.currentMessage = 'Job Finished';
      this.showMessage = true;

      this.$root.$emit('addMoney', job.payment);

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
