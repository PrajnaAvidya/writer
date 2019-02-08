<template>
  <div>
    <div class="milestones is-size-3">
      Milestones (this life): {{ currency.milestones | round }}
    </div>
    <div class="is-size-4">
      Milestones (stored): {{ currency.milestones | round }}
    </div>
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
.milestones {
  font-weight: bolder;
}
</style>
