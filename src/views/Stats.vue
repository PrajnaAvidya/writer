<template>
  <div>
    <table class="table">
      <tbody>
        <tr>
          <th>Words Written</th>
          <td>{{ statistics.words | round }}</td>
        </tr>
        <tr>
          <th>Words Written from Clicks</th>
          <td>{{ statistics.clickWords | round }}</td>
        </tr>
        <tr>
          <th>Money Made</th>
          <td>{{ statistics.money | moneyCents }}</td>
        </tr>
        <tr>
          <th>Money Spent</th>
          <td>{{ statistics.moneySpent | moneyCents }}</td>
        </tr>
        <tr>
          <th>Coffees Drank</th>
          <td>{{ statistics.caffeines | round }}</td>
        </tr>
        <tr>
          <th>Workers Bought</th>
          <td>{{ statistics.workers | round }}</td>
        </tr>
        <tr>
          <th>Jobs Completed</th>
          <td>{{ statistics.jobs | round }}</td>
        </tr>
        <tr>
          <th>Urgent Jobs Completed</th>
          <td>{{ statistics.urgentJobs | round }}</td>
        </tr>
        <tr>
          <th>Upgrades Bought</th>
          <td>{{ statistics.upgrades | round }} ({{ upgradePercent }}%)</td>
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
      return this.statistics.upgrades.div(this.statistics.totalUpgrades).times(100).toFixed(0);
    },
    ...mapState([
      'statistics',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.table {
  margin: 0 auto;
}
</style>
