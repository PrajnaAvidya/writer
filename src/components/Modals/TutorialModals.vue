<template>
  <BaseModal
    ref="modal"
    :show-header="false"
    :show-footer="false"
    :click-to-close="true"
  >
    <div>
      {{ modalText }}
    </div>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/Modals/BaseModal.vue';

export default {
  name: 'TutorialModals',
  components: {
    BaseModal,
  },
  data: () => ({
    modalText: 'asdfasdfasdf',
  }),
  mounted() {
    // TODO logic to display modals
    this.$refs.modal.open();
  },
};
</script>
