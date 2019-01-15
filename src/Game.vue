<template>
  <div id="game">
    <div class="ideas">Ideas: {{ ideas | roundPositive }}</div>
    <div class="draft">Words: {{ words | round }}</div>

    <creative-buttons
      @think="think"
      @write="write"
    />

    <div class="money">Money: {{ money | money }}</div>

    <hr />

    <buy-amounts
      @setBuyAmount="setBuyAmount"
    />

    <div class="production columns is-multiline">
      <!-- row -->
      <div class="column is-half">
        <a class="button" @click="coffee">Drink Coffee</a>
      </div>
      <div class="column is-half">
        <span v-if="buzzActive()">Caffeine Buzz Remaining: {{ buzzRemaining() }} seconds</span>
      </div>
      <!-- /row -->

      <!-- row -->
      <div class="column is-one-third">
        <a class="button" @click="hireChild">Hire Child</a>
      </div>
      <div class="column is-one-third">
        Cost {{ childCurrentCost | money }} for {{ buyAmount }}
      </div>
      <div class="column is-one-third">
        <span v-if="children > 0">Children: {{ children | round }}</span>
      </div>
      <!-- /row -->

      <!-- row -->
      <div class="column is-one-third">
        <a class="button" @click="hireStudent">Hire Student</a>
      </div>
      <div class="column is-one-third">
        Cost {{ studentCurrentCost | money }} for {{ buyAmount }}
      </div>
      <div class="column is-one-third">
        <span v-if="students > 0">Students: {{ students | round }}</span>
      </div>
      <!-- /row -->
    </div>
  </div>
</template>

<script>
import Big from 'big.js';
import utils from './utils';
// import { mapGetters } from 'vuex';

import BuyAmounts from './components/BuyAmounts.vue';
import CreativeButtons from './components/CreativeButtons.vue';

export default {
  name: 'game',
  components: {
    BuyAmounts,
    CreativeButtons,
  },
  data: () => ({
    // currencies
    ideas: Big(0),
    words: Big(0),
    money: Big(1000),

    baseWrite: Big(1),
    maxWrite: Big(3),

    children: Big(0),
    childIdeas: Big(1),
    childBaseCost: Big(10),
    childCostMultiplier: 0.1,
    childCurrentCost: Big(10),

    students: Big(0),
    studentWords: Big(1),
    studentBaseCost: Big(100),
    studentCostMultiplier: 0.15,
    studentCurrentCost: Big(100),

    buyAmount: 1,

    // used for tick function
    lastFrame: null,

    // caffeine
    caffeineTime: 60,
    caffeineMaxTime: 300,
    caffeineEndTime: -1,
    caffeineMultiplier: Big(1),
  }),
  /*
  computed: {
    ...mapGetters([
      // 'words',
      // 'caffeine',
    ]),
  },
  */
  mounted() {
    this.calculateBuyCosts();
    window.requestAnimationFrame(this.tick);
  },
  methods: {
    tick(timestamp) {
      // get time since last frame
      const progress = timestamp - this.lastFrame;

      // restrict game to 30 fps
      if (progress < 33.333) {
        window.requestAnimationFrame(this.tick);
        return;
      }

      // set current frame
      this.lastFrame = timestamp;

      // how much to divide progress current tick
      const frameDivision = Big(1000).div(progress);

      // actual frame updates
      const frameIncrement = Big(1).div(frameDivision);

      // caffeine buzz
      if (this.buzzActive()) {
        this.ideas = this.ideas.plus(this.caffeineMultiplier.times(frameIncrement));
      }

      // children
      if (this.children.gt(0)) {
        this.ideas = this.ideas.plus(this.children.times(frameIncrement).times(this.childIdeas));
      }

      // students
      if (this.students.gt(0) && this.ideas.gt(frameIncrement)) {
        this.ideas = this.ideas.minus(this.students.times(frameIncrement).times(this.studentWords));
        this.words = this.words.plus(this.students.times(frameIncrement).times(this.studentWords));
      }

      // get next frame
      window.requestAnimationFrame(this.tick);
    },

    // TODO only game core stuff (ie ticks) should be in here, everything else in components
    think() {
      const ideaCount = this.buzzActive() ? 2 : 1;
      this.ideas = this.ideas.plus(ideaCount);
    },
    write() {
      if (this.ideas.lt(1)) {
        return;
      }

      this.ideas = this.ideas.minus(1);
      let words = utils.randomInt(this.baseWrite, this.maxWrite);
      if (this.buzzActive()) {
        words *= 2;
      }
      this.words = this.words.plus(words);
    },
    coffee() {
      if (this.money.lt(1) || this.buzzRemaining() > this.caffeineMaxTime - 5) {
        return;
      }
      if (!this.buzzActive()) {
        this.caffeineEndTime = utils.unixTimestamp() + this.caffeineTime;
      } else {
        this.caffeineEndTime += this.caffeineTime;
        if (this.caffeineEndTime - utils.unixTimestamp() > this.caffeineMaxTime) {
          this.caffeineEndTime = utils.unixTimestamp() + this.caffeineMaxTime;
        }
      }

      this.money = this.money.minus(1);
    },
    buzzActive() {
      return this.caffeineEndTime > utils.unixTimestamp();
    },
    buzzRemaining() {
      return this.caffeineEndTime - utils.unixTimestamp();
    },

    hireChild() {
      if (this.money.lt(this.childCurrentCost)) {
        return;
      }
      this.money = this.money.minus(this.childCurrentCost);
      this.children = this.children.plus(this.buyAmount);
      this.calculateBuyCosts();
    },
    hireStudent() {
      if (this.money.lt(this.studentCurrentCost)) {
        return;
      }
      this.money = this.money.minus(this.studentCurrentCost);
      this.students = this.students.plus(this.buyAmount);
      this.calculateBuyCosts();
    },

    setBuyAmount(index) {
      this.buyAmount = 10 ** index;
      this.calculateBuyCosts();
    },
    buyCost(baseCost, owned, costMultiplier) {
      return Big(baseCost).times(Big(1 + costMultiplier).pow(parseInt(owned.plus(this.buyAmount), 10))
        .minus(Big(1 + costMultiplier).pow(parseInt(owned, 10)))).div(costMultiplier).round();
    },
    calculateBuyCosts() {
      this.childCurrentCost = this.buyCost(this.childBaseCost, this.children, this.childCostMultiplier);
      this.studentCurrentCost = this.buyCost(this.studentBaseCost, this.students, this.studentCostMultiplier);
    },
  },
};
</script>

<style lang="scss">
#game {
  text-align: center;
}
.production {
  margin: 0 auto;
  width: 800px;
}
.buttons {
  margin: 0 auto;
  width: 200px;
}
.buy-amounts {
  width: 200px;
  margin: 0 auto;
}
</style>
