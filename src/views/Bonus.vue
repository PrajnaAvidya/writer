<template>
  <div>
    <div class="bonus-title is-size-3">
      Plot Points: {{ rebirth.plotPoints | round }}
    </div>
    <p>
      You are currently receiving a <strong>{{ rebirth.plotPoints | round }}% bonus to clicks, caffeine, and workers.</strong> You may spend some of your plot points on the following abilities:
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Bonus',
  computed: {
    ...mapState([
      'rebirth',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.bonus-title {
  margin: 10px;
}
</style>
