<template>
  <section class="section">
    <div class="container" id="app">
      <div id="nav">
        <router-link to="/">Home</router-link>
      </div>

      <router-view/>
    </div>
    </section>
</template>

<style lang="scss">
#app {
  text-align: center;
}
#nav {
  padding-bottom: 20px;
}
</style>
