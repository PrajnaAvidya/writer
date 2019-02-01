<template>
  <section class="section nav">
    <div id="nav">
      <hr>
      <RouterLink to="/workers">
        <span class="nav-link">
          Workers
        </span>
      </RouterLink>
      |
      <RouterLink to="/jobs">
        <span class="nav-link">
          Jobs
        </span>
      </RouterLink>
      |
      <RouterLink to="/upgrades">
        <span class="nav-link">
          Upgrades
        </span>
      </RouterLink>
      |
      <RouterLink to="/stats">
        <span class="nav-link">
          Stats
        </span>
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
.nav-link {
  font-size: 16pt;
}
</style>
