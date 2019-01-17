<template>
  <div class="columns buttons">
    <div class="column">
      <BTooltip
        label="Think of ideas"
        position="is-bottom"
      >
        <a
          class="button is-primary is-large"
          @click="$emit('think')"
        >
          <BIcon icon="brain" />
        </a>
      </BTooltip>
    </div>

    <div class="column">
      <BTooltip
        label="Write some words"
        position="is-bottom"
      >
        <a
          class="button is-primary is-large"
          @click="$emit('write')"
        >
          <BIcon icon="pen" />
        </a>
      </BTooltip>
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
