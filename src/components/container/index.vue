<template>
  <div>
    <CommentsList v-if="ready" :config="configs" />
  </div>
</template>

<script lang="ts">
/**
 *   Nexment Container
 *   main entry
 */
import { Component, Vue, Prop } from "vue-property-decorator";
import CommentsList from "../sections/CommentsList.vue";

// Composition API Vue 2 plugin
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);

// Tooltip
import VTooltip from "v-tooltip";
Vue.use(VTooltip);

// Markdown
import VueShowdown from "vue-showdown";
import { markDownConfigs } from "../../configs/index";
Vue.use(VueShowdown, {
  options: markDownConfigs,
});

// Modal
import VModal from "vue-js-modal";
Vue.use(VModal);

// Identifier generator
import getIdentifier from "../../lib/utils/getIdentifier";

@Component({
  components: {
    CommentsList,
  },
})
export default class NexmentContainer extends Vue {
  // Get config props
  @Prop() public config!: nexmentConfigType;
  configs: nexmentConfigType = this.$props.config;
  ready:boolean = false;
  mounted() {
    if (this.$props.config.pageKey === undefined) {
      this.$set(this.configs, "pageKey", getIdentifier().identifierData);
    }
    this.ready = true;
  }
}
</script>
