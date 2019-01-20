<template>
  <div
    class="jobs"
    :hidden="!showJobs"
  >
    <BMessage
      has-icon
      :type="messageType"
      :title="messageTitle"
      :active.sync="showMessage"
    >
      {{ currentMessage }}
    </BMessage>

    <div class="jobs-table">
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
  </div>
</template>

<script>
import Big from 'big.js';

export default {
  name: 'JobsGrid',
  props: {
    showJobs: Boolean,
    words: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    showMessage: false,
    messageType: '',
    messageTitle: '',
    currentMessage: '',
    exampleJobs: [
      { index: 0, wordCount: Big(100), name: 'Blurb', payment: Big(5) },
      { index: 1, wordCount: Big(200), name: 'Op-Ed', payment: Big(11) },
      { index: 2, wordCount: Big(400), name: 'Editorial', payment: Big(24) },
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
      const job = this.exampleJobs[index];

      if (this.words.gte(job.wordCount)) {
        this.succeedJob();
        this.$root.$emit('addMoney', job.payment);
      } else {
        this.failJob();
      }

      // subtract words
      this.$root.$emit('subtractWords', job.wordCount);

      // TODO start jobs cooldown
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
