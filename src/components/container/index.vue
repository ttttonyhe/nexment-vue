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

@Component({
  components: {
    CommentsList,
  },
})
export default class NexmentContainer extends Vue {
  // Get config props
  @Prop() public config!: nexmentConfigType
}
</script>
