<template>
  <div class="buy-amounts">
    <div class="tabs is-toggle is-small">
      <ul>
        <li
          :class="{ 'is-active': buyIndex === 0 }"
          @click="buyIndex = 0"
        >
          <a>
            <span>Buy 1</span>
          </a>
        </li>
        <li
          :class="{ 'is-active': buyIndex === 1 }"
          @click="buyIndex = 1"
        >
          <a>
            <span>Buy 10</span>
          </a>
        </li>
        <li
          :class="{ 'is-active': buyIndex === 2 }"
          @click="buyIndex = 2"
        >
          <a><span>Buy 100</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'BuyAmounts',
  computed: {
    buyIndex: {
      get() {
        return this.buyAmountIndex;
      },
      set(value) {
        this.setBuyAmountIndex(value);
      },
    },
    ...mapState([
      'buyAmountIndex',
    ]),
  },
  methods: {
    ...mapMutations([
      'setBuyAmountIndex',
    ]),
  },
};
</script>

<style lang="scss">
.buy-amounts {
  width: 200px;
  margin: 0 auto;
  padding-bottom: 20px;
}
.tab-content {
  padding: 0 !important;
}
</style>
