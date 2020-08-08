<template>
  <div>
    <sweet-modal ref="repliesModalRef">This is an alert.</sweet-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
const SweetModal = require('sweet-modal-vue').SweetModal;
const SweetModalTab = require('sweet-modal-vue').SweetModalTab;
export default defineComponent({
  name:'ReplyModal',
  components: {
    SweetModal,
    SweetModalTab,
  },
  props: {
    type: String,
    content: Object,
    replyTo: String,
    pageKey: String,
    replyToID: Number,
    replyToOID: String,
    replyToName: String,
    visibilityFunction: Function,
    replyItem: Object,
  },
  mounted() {
    this.toggleModal();
    console.log(this.$props.pageKey);
  },
  methods: {
    toggleModal() {
      const modalRef: any = this.$refs.repliesModalRef;
      modalRef.open();
    },
  },
});
</script>
