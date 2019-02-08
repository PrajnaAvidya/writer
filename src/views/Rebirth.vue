<template>
  <div>
    <span class="title is-size-3">
      Milestones: {{ currency.milestones | round }}
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Rebirth',
  computed: {
    ...mapState([
      'currency',
    ]),
  },
};
</script>

<style lang="scss" scoped>

</style>
