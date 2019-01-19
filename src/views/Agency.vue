<template>
  <div class="home">
    <JobsGrid
      :show-jobs="showJobs"
      :words="words"
    />

    <SellWriting
      :writing-value="writingValue"
    />
  </div>
</template>

<script>
import JobsGrid from '../components/JobsGrid.vue';
import SellWriting from '../components/SellWriting.vue';

export default {
  name: 'Agency',
  components: {
    JobsGrid,
    SellWriting,
  },
  props: {
    showJobs: Boolean,
    words: {
      type: Object,
      required: true,
    },
    writingValue: {
      type: Object,
      required: true,
    },
  },
};
</script>
