<template>
  <div
    class="jobs"
    :hidden="!showJobs"
  >
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
        Come back later for new jobs
      </div>
    </div>
  </div>
</template>

<script>
import Big from 'big.js';
import { mapState, mapMutations } from 'vuex';
import unixTimestamp from '../utils/unixTimestamp';

export default {
  name: 'JobsGrid',
  props: {
    showJobs: Boolean,
    words: {
      type: Object,
      required: true,
    },
    jobTimer: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    showMessage: false,
    messageTitle: '',
    currentMessage: '',
    exampleJobs: [
      { index: 0, wordCount: Big(100), name: 'Blurb', payment: Big(5) },
      { index: 1, wordCount: Big(200), name: 'Op-Ed', payment: Big(11) },
      { index: 2, wordCount: Big(400), name: 'Editorial', payment: Big(24) },
    ],
  }),
  computed: {
    ...mapState([
      'jobActive',
    ]),
  },
  methods: {
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
      this.resetJobTimer(this.jobTimer);
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
