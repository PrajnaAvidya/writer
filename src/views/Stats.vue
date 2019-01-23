<template>
  <div>
    <table class="table">
      <tbody>
        <tr>
          <th>Ideas Had</th>
          <td>{{ stats.ideas | round }}</td>
        </tr>
        <tr>
          <th>Words Written</th>
          <td>{{ stats.words | round }}</td>
        </tr>
        <tr>
          <th>Ideas Had from Clicks</th>
          <td>{{ stats.clickIdeas | round }}</td>
        </tr>
        <tr>
          <th>Words Written from Clicks</th>
          <td>{{ stats.clickWords | round }}</td>
        </tr>
        <tr>
          <th>Money Made</th>
          <td>{{ stats.money | moneyCents }}</td>
        </tr>
        <tr>
          <th>Money Spent</th>
          <td>{{ stats.moneySpent | moneyCents }}</td>
        </tr>
        <tr>
          <th>Jobs Completed</th>
          <td>{{ stats.jobs | round }}</td>
        </tr>
        <tr>
          <th>Upgrades Bought</th>
          <td>{{ stats.upgrades | round }} ({{ upgradePercent }}%)</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Stats',
  computed: {
    upgradePercent() {
      return this.stats.upgrades.div(this.stats.totalUpgrades).times(100).toFixed(0);
    },
    ...mapState([
      'stats',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.table {
  margin: 0 auto;
}
</style>
