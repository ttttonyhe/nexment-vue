<template>
  <div>
    <div v-if="error">
      <div className="nexment-empty">
        <div>{Icons().commentsError}</div>
        <p>{Translation.serviceError}</p>
        <div className="nexment-error">
          <p>{Translation.problemShooting}</p>
          <p>
            {Translation.problemDes}&nbsp;|&nbsp;
            <a href="https://nexment.ouorz.com" target="_blank">
              {Translation.documentation}
            </a>
          </p>
        </div>
      </div>
    </div>
    <div v-if="!data">
      <div className="nexment-loading">
        <ContentLoader :speed="2" :width="700">
          <rect x="52" y="8" rx="3" ry="3" width="100%" height="10" />
          <rect x="52" y="30" rx="3" ry="3" width="80%" height="10" />
          <rect x="52" y="56" rx="3" ry="3" width="6" height="38" />
          <rect x="69" y="56" rx="3" ry="3" width="60%" height="6" />
          <rect x="69" y="72" rx="3" ry="3" width="50%" height="6" />
          <rect x="69" y="88" rx="3" ry="3" width="30%" height="6" />
          <circle cx="20" cy="24" r="20" />
        </ContentLoader>
      </div>
    </div>
    <div v-else>
      <sweet-modal ref="modal">This is an alert.</sweet-modal>
      <button @click="open()">Open</button>
      <p v-for="(item, index) in data" :key="index">{{ item.name }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import '../../assets/style/commentslist.scss';
// NOTE: Replace with 'vue' when migrating to Vue 3
import { defineComponent, reactive } from '@vue/composition-api';

// SWRV feature (Composition API required)
import useSWRV from 'swrv';
import listFetcher from '../../lib/database/getCommentsList';

// Using require to avoid type error
const ContentLoader = require('vue-content-loader').ContentLoader;

import { nexmentConfigType } from '../../types/index';

const SweetModal = require('sweet-modal-vue').SweetModal;
const SweetModalTab = require('sweet-modal-vue').SweetModalTab;

export default defineComponent({
  name: 'CommentsList',
  props: ['config'],
  components: {
    ContentLoader,
    SweetModal,
    SweetModalTab,
  },
  setup(props: { config: nexmentConfigType }) {
    const state = reactive({
      message: 'fuck',
      iconName: '',
    });
    const { data, error } = useSWRV('demoPage', listFetcher(props.config));
    return {
      state,
      data,
      error,
    };
  },
  methods: {
    open() {
      const ref: any = this.$refs.modal;
      ref.open();
    },
  },
});
</script>
