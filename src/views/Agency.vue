<template>
  <div class="home">
    <JobsGrid />
  </div>
</template>

<script>
import JobsGrid from '@/components/JobsGrid.vue';

export default {
  name: 'Agency',
  components: {
    JobsGrid,
  },
};
</script>
