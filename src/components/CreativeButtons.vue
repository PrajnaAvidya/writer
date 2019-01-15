<template>
  <div class="columns buttons">
    <div class="column">
      <b-tooltip
        label="Think of ideas"
        position="is-bottom"
      >
        <a class="button is-primary is-large" @click="$emit('think')">
          <b-icon icon="brain" />
        </a>
      </b-tooltip>
    </div>

    <div class="column">
      <b-tooltip
        label="Write some words"
        position="is-bottom"
      >
        <a class="button is-primary is-large" @click="$emit('write')">
          <b-icon icon="pen" />
        </a>
      </b-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'creative-buttons',
};
</script>

<style scoped lang="scss">

</style>
