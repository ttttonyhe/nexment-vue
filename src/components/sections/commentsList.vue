<template>
  <div>
    <div v-if="error">failed to load</div>
    <div v-if="!data">loading...</div>
    <div v-else>
      <p v-for="(item, index) in data" :key="index">{{ item.name }}</p>
    </div>
  </div>
</template>
<script lang="ts">
// NOTE: Replace with 'vue' when migrating to Vue 3
import { defineComponent, reactive } from '@vue/composition-api';

// SWRV feature (Composition API required)
import useSWRV from 'swrv';
import listFetcher from '../../lib/database/getCommentsList';

import { nexmentConfigType } from '../../typings/index';
export default defineComponent({
  name: 'CommentsList',
  props: ['config'],
  setup(props: { config: nexmentConfigType }) {
    const state = reactive({
      message: 'fuck',
    });
    const { data, error } = useSWRV('demoPage', listFetcher(props.config));
    return {
      state,
      data,
      error,
    };
  },
});
</script>
