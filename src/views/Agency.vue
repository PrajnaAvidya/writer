<template>
  <div class="home">
    <JobsGrid
      :words="words"
      :job-cooldown="jobCooldown"
    />
  </div>
</template>

<script>
import JobsGrid from '@/components/JobsGrid.vue';
import SellWriting from '@/components/SellWriting.vue';

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
    jobCooldown: {
      type: Number,
      required: true,
    },
  },
};
</script>
