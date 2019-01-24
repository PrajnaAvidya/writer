<template>
  <div class="columns buttons">
    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-left"
        data-tooltip="Think of ideas"
        @click="$root.$emit('think')"
      >
        <i class="fas fa-brain fa-lg" />
      </a>
    </div>

    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-right"
        data-tooltip="Write some words"
        @click="$root.$emit('write')"
      >
        <i class="fas fa-pen fa-lg" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreativeButtons',
};
</script>

<style scoped lang="scss">
.buttons {
  margin: 0 auto;
  width: 200px;
}
</style>
