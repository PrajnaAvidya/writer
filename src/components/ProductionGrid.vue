<template>
  <div class="production columns is-multiline">
    <!-- row -->
    <div class="column is-one-third">
      <a class="button" @click="$emit('hireChild')">Hire Child</a>
    </div>
    <div class="column is-one-third">
      Cost {{ childCurrentCost | money }} for {{ buyAmount }}
    </div>
    <div class="column is-one-third">
      <span v-if="children.gt(0)">Children: {{ children | round }}</span>
    </div>
    <!-- /row -->

    <!-- row -->
    <div class="column is-one-third">
      <a class="button" @click="$emit('hireStudent')">Hire Student</a>
    </div>
    <div class="column is-one-third">
      Cost {{ studentCurrentCost | money }} for {{ buyAmount }}
    </div>
    <div class="column is-one-third">
      <span v-if="students.gt(0)">Students: {{ students | round }}</span>
    </div>
    <!-- /row -->
  </div>
</template>

<script>
import Big from 'big.js';

export default {
  name: 'production-grid',
  props: {
    buyAmount: Number,
    children: Big,
    childCurrentCost: Big,
    students: Big,
    studentCurrentCost: Big,
  },
};
</script>

<style lang="scss" scoped>
.production {
  margin: 0 auto;
  width: 800px;
}
</style>
