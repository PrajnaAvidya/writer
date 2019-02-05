<template>
  <BaseModal
    ref="modal"
    :initial-state="!(debug.enabled && debug.disableTutorials)"
    :show-header="false"
    :show-footer="false"
  >
    <div class="field is-grouped text input-text">
      I am a struggling writer named &nbsp;
      <p class="control">
        <input
          v-model="playerName"
          class="input test1234"
          type="text"
        >
      </p>
      &nbsp; down to my very last dollar
    </div>
    <div class="text">
      All that I can do now is write as many WORDS as possible.
    </div>
    <button
      class="button is-primary"
      @click="closeIntro()"
    >
      OK
    </button>
  </BaseModal>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BaseModal from '@/components/Modals/BaseModal.vue';

export default {
  name: 'IntroModal',
  components: {
    BaseModal,
  },
  data: () => ({
    playerName: 'Rafiq',
  }),
  computed: {
    ...mapState([
      'debug',
    ]),
  },
  methods: {
    closeIntro() {
      this.updateData({ index: 'playerName', value: this.playerName });
      this.$refs.modal.close();
    },
    ...mapMutations([
      'updateData',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.button {
  margin-top: 10px;
}
.text {
  text-align: center;
  height: 35px;
  line-height: 35px;
}
.input-text {
  margin-left: 10px;
}
input {
  width: 150px;
}
</style>
