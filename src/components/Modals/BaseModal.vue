<template>
  <div
    class="modal"
    :class="{ 'is-active': active }"
    @click="clickToClose ? close() : null"
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
          @click="close()"
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
    initialState: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    clickToClose: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    active: false,
  }),
  mounted() {
    this.active = this.initialState;
  },
  methods: {
    open() {
      this.active = true;
    },
    close() {
      this.active = false;
    },
  },
};
</script>
