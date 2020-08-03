<template>
  <div class="example-container">
    <client-only>
      <NexmentContainer :config="configs" />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Nexment from '../../src/index';
Vue.use(Nexment);
export default Vue.extend({
  data() {
    return {
      configs: {
        pageKey: 'demoPage',
        leancloud: {
          appId: '6Kcb9HB1iOR87HUbAvnMyUER-gzGzoHsz',
          appKey: 'zf3gAf9CGIHLL8Crctb0sJLV',
          serverURL: 'https://leancloud.ouorz.com',
        },
        admin: {
          name: 'TonyHe',
          email: 'he@holptech.com',
        },
      },
    };
  },
});
</script>
<style scoped>
.example-container {
  width: 650px;
  margin: 0 auto;
  padding: 20px;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}
</style>

<style></style>
