<template>
  <div>
    <table class="table">
      <tbody>
        <tr>
          <th>Ideas Had</th>
          <td>69</td>
        </tr>
        <tr>
          <th>Words Written</th>
          <td>420</td>
        </tr>
        <tr>
          <th>Money Made</th>
          <td>{{ 69 | money }}</td>
        </tr>
        <tr>
          <th>Jobs Completed</th>
          <td>420</td>
        </tr>
        <tr>
          <th>Upgrades Bought</th>
          <td>69%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Stats',
};
</script>

<style lang="scss" scoped>
.table {
  margin: 0 auto;
}
</style>
