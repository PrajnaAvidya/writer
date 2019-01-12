<template>
  <div id="app">
    <!--div id="nav">
      <router-link to="/">Home</router-link>
    </div-->

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
#app {
  text-align: center;
}
#nav {
  margin-bottom: 20px;
}
</style>
