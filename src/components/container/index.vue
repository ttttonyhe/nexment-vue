<template>
  <div>
    <CommentsList :config="config" />
  </div>
</template>

<script lang="ts">
/**
 *   Nexment Container
 *   main entry
 */
import { Component, Vue, Prop } from 'vue-property-decorator';
import CommentsList from '../sections/CommentsList.vue';

// Composition API Vue 2 plugin
import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);

// Configuration type
import { nexmentConfigType } from '../../types/index';

@Component({
  components: {
    CommentsList,
  },
})
export default class Main extends Vue {
  // Get config props
  @Prop()
  config: nexmentConfigType;
}
</script>
