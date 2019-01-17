<template>
  <div class="jobs">
    <BMessage
      has-icon
      :type="messageType"
      :title="messageTitle"
      :active.sync="showMessage"
    >
      {{ currentMessage }}
    </BMessage>

    <div
      v-if="!currentJob"
      class="jobs-table"
    >
      <div class="jobs-header">
        Available Jobs
      </div>
      <BTable
        :data="exampleJobs"
        :columns="columns"
      >
        <template slot-scope="props">
          <BTableColumn
            field="wordCount"
            numeric
          >
            {{ props.row.wordCount | round }}
          </BTableColumn>
          <BTableColumn field="name">
            {{ props.row.name }}
          </BTableColumn>
          <BTableColumn
            field="payment"
            numeric
          >
            {{ props.row.payment | money }}
          </BTableColumn>
          <BTableColumn field="accept">
            <a
              class="button is-small is-primary"
              @click="acceptJob(props.row.index)"
            >
              Accept Job
            </a>
          </BTableColumn>
        </template>
      </BTable>
    </div>

    <div v-else>
      <div class="jobs-header">
        Current Job: {{ currentJob.name }}
      </div>
      <div class="jobs-subheader">
        Minimum Word Count: {{ currentJob.wordCount | round }}
      </div>
      <div class="jobs-subheader">
        Current Word Count: {{ words | round }}
      </div>
      <a
        class="button is-primary is-small"
        @click="finishJob"
      >
        Turn In
      </a>
    </div>
  </div>
</template>

<script>
import Big from 'big.js';

export default {
  name: 'JobsGrid',
  props: {
    words: {
      type: Big,
      required: true,
    },
  },
  data: () => ({
    showMessage: false,
    messageType: '',
    messageTitle: '',
    currentMessage: '',
    currentJob: null, // TODO
    exampleJobs: [
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
      this.messageTitle = 'Job Accepted';
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
      this.messageTitle = 'Success';
      this.currentMessage = 'Job Finished';
      this.showMessage = true;
    },
    failJob() {
      this.messageType = 'is-danger';
      this.messageTitle = 'Failure';
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
