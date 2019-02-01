<template>
  <section class="section nav">
    <div id="nav">
      <hr>
      <RouterLink to="/workers">
        <i class="fas fa-building fa-lg" />
        Workers
      </RouterLink>
      |
      <RouterLink to="/jobs">
        <i class="fas fa-briefcase fa-lg" />
        Jobs
      </RouterLink>
      |
      <RouterLink to="/upgrades">
        <i class="fas fa-arrow-up fa-lg" />
        Upgrades
      </RouterLink>
      |
      <RouterLink to="/stats">
        <i class="fas fa-chart-line fa-lg" />
        Stats
      </RouterLink>
      <hr>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NavBar',
};
</script>

<style lang="scss" scoped>
.nav {
  font-size: 16pt;
}
</style>
