<template>
  <div>
    <div v-for="worker in workers" :key="worker.id" class="production columns">
      <div class="column">
        <a class="button" @click="$emit('hireWorker', worker.id)">Hire {{ worker.name }}</a>
      </div>
      <div class="column">
        Cost {{ worker.cost | money }} for {{ buyAmount }}
      </div>
      <div class="column">
        <span v-if="worker.count > 0">{{ worker.plural }}: {{ worker.count }} TODO ASSIGNMENTS</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'production-grid',
  props: {
    buyAmount: Number,
    workers: Object,
  },
};
</script>

<style lang="scss" scoped>
.production {
  margin: 0 auto;
  width: 800px;
}
</style>
