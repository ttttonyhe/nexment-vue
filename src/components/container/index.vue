<template>
  <div>
    <CommentsList v-if="ready" :config="configs" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

// Comments list component
import CommentsList from "../sections/CommentsList.vue";

// Composition API
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);

// Tooltip library
import VTooltip from "v-tooltip";
Vue.use(VTooltip);

// Markdown library
import VueShowdown from "vue-showdown";
import { markDownConfigs } from "../../configs/index";
Vue.use(VueShowdown, {
  options: markDownConfigs,
});

// Modal library
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

  // Display status
  ready:boolean = false;

  mounted() {
    // Determine whether use identifier generator or not
    if (this.$props.config.pageKey === undefined) {
      this.$set(this.configs, "pageKey", getIdentifier().identifierData);
    }
    // Display component
    this.ready = true;
  }
}
</script>
