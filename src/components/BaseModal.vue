<template>
  <div
    class="modal"
    :class="{'is-active': active}"
    @click="clickToClose ? close($event) : null"
  >
    <div class="modal-background" />
    <div class="modal-card">
      <header
        v-if="showHeader"
        class="modal-card-head"
      >
        <p class="modal-card-title">
          {{ title }}
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="close($event)"
        />
      </header>
      <section class="modal-card-body">
        <slot />
      </section>
      <footer
        v-if="showFooter"
        class="modal-card-foot"
      >
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialState: Boolean,
    title: {
      type: String,
      default: '',
    },
    showHeader: Boolean,
    showFooter: Boolean,
    clickToClose: Boolean,
  },
  data: () => ({
    active: false,
  }),
  mounted() {
    this.active = this.initialState;
  },
  methods: {
    open($event) {
      this.$emit('open', $event);
      this.active = true;
    },
    close($event) {
      this.$emit('close', $event);
      this.active = false;
    },
  },
};
</script>
