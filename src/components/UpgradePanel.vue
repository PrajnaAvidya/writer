<template>
  <div>
    <div class="columns">
      <div class="column">
        <strong>Upgrade Name</strong>
      </div>
      <div class="column">
        Upgrade Description/Cost
      </div>
      <div class="column">
        <a
          class="button"
          @click="$emit('buyUpgrade', upgrade.id)"
        >
          Buy ($1000)
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpgradePanel',
};
</script>

<style lang="scss" scoped>

</style>
