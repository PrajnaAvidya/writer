<template>
  <div class="home">
    <JobsGrid
      :words="words"
      :job-timer="jobTimer"
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
  },
  props: {
    words: {
      type: Object,
      required: true,
    },
    jobTimer: {
      type: Number,
      required: true,
    },
  },
};
</script>
