<template>
  <div class="jobs">
    <b-message
    has-icon
    :type="messageType"
    :auto-close=true
    :duration=5000
    :active.sync="showMessage"
    >
      {{ currentMessage }}
    </b-message>

    <div class="jobs-table" v-if="!currentJob">
      <div class="jobs-header">Available Jobs</div>
      <b-table :data="jobs" :columns="columns">
        <template slot-scope="props">
          <b-table-column field="wordCount" numeric>
            {{ props.row.wordCount | round }}
          </b-table-column>
          <b-table-column field="name">
            {{ props.row.name }}
          </b-table-column>
          <b-table-column field="payment" numeric>
            {{ props.row.payment | money }}
          </b-table-column>
          <b-table-column field="accept">
            <a
              class="button is-small is-primary"
              @click="acceptJob(props.row.index)"
            >Accept Job</a>
          </b-table-column>
        </template>
      </b-table>
    </div>

    <div v-else>
      <div class="jobs-header">Current Job: {{ currentJob.name }}</div>
      <div class="jobs-subheader">Minimum Word Count: {{ currentJob.wordCount | round }}</div>
      <div class="jobs-subheader">Current Word Count: {{ words | round }}</div>
      <a
        class="button is-primary is-small"
        @click="finishJob"
      >Turn In</a>
    </div>
  </div>
</template>

<script>
import Big from 'big.js';

export default {
  name: 'jobs-grid',
  props: {
    words: Big,
  },
  data: () => ({
    showMessage: false,
    messageType: '',
    currentMessage: '',
    currentJob: null, // TODO
    jobs: [
      { index: 0, wordCount: Big(100), name: 'Blurb', payment: Big(10) },
      { index: 1, wordCount: Big(200), name: 'Op-Ed', payment: Big(25) },
      { index: 2, wordCount: Big(300), name: 'Editorial', payment: Big(50) },
    ],
    columns: [
      {
        field: 'wordCount',
        label: 'Word Count',
        numeric: true,
        width: 120,
      },
      {
        field: 'name',
        label: 'Job Name',
        width: 400,
      },
      {
        field: 'payment',
        label: 'Payment',
        numeric: true,
      },
      {
        field: 'accept',
        label: 'Accept',
        width: 200,
      },
    ],
  }),
  methods: {
    acceptJob(index) {
      this.currentJob = this.jobs[index];
      this.messageType = 'is-info';
      this.currentMessage = `Accepted job ${this.currentJob.name}`;
      this.$emit('startJob');
      this.showMessage = true;
    },
    finishJob() {
      if (this.words >= this.currentJob.wordCount) {
        this.succeedJob();
        this.$emit('finishJob', this.currentJob.payment);
      } else {
        this.failJob();
        this.$emit('finishJob', Big(0));
      }
      this.currentJob = null;
    },
    succeedJob() {
      this.messageType = 'is-success';
      this.currentMessage = 'Job Finished';
      this.showMessage = true;
    },
    failJob() {
      this.messageType = 'is-danger';
      this.currentMessage = 'Job Failed';
      this.showMessage = true;
    },
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
