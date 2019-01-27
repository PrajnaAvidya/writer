<template>
  <div>
    <div>
      Words: {{ words | round }}
    </div>
    <div>
      Words per Second: {{ workerWps | round }}
    </div>
    <div>
      Money: {{ money | moneyCents }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CurrencyDisplay',
  computed: {
    ...mapState([
      'words',
      'workerWps',
      'money',
    ]),
  },
};
</script>

<style lang="scss" scoped>

</style>
