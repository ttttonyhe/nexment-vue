<template>
  <div>
    <CommentsList v-if="ready" :config="configs" />
  </div>
</template>

<style lang="scss">
/* Nexment Styles */
@import "../../assets/style/commentarea.scss";
@import "../../assets/style/commentslist.scss";
@import "../../assets/style/container.scss";
@import "../../assets/style/modal.scss";
@import "../../assets/style/reply.scss";
</style>

<style>
/* Nexment Libraries Styles */
@import "../../../node_modules/vue-js-modal/dist/styles.css";
@import "../../../node_modules/github-markdown-css/github-markdown.css";
</style>

<script lang="ts">
/**
 * Nexment Web Component
 * main entry
 */
import { Component, Vue, Prop } from "vue-property-decorator";

// Comments list component
import CommentsList from "@/components/sections/CommentsList.vue";

// Composition API
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);

// Tooltip library
import VTooltip from "v-tooltip";
Vue.use(VTooltip);

// Markdown library
import VueShowdown from "vue-showdown";
import { markDownConfigs } from "@/configs/index";
Vue.use(VueShowdown, {
  options: markDownConfigs,
});

// Modal library
import VModal from "vue-js-modal";
Vue.use(VModal);

// Identifier generator
import getIdentifier from "@/lib/utils/getIdentifier";

@Component({
  components: {
    CommentsList,
  },
})
export default class NexmentContainer extends Vue {
  // Get props
  @Prop() public pagekey!: string;

  @Prop() public enablelinkinput!: boolean;

  @Prop() public enableReplyListModal!: boolean;

  @Prop() public appid!: string;

  @Prop() public appkey!: string;

  @Prop() public serverurl!: string;

  @Prop() public name!: string;

  @Prop() public email!: string;

  // Set default config
  public configs: nexmentConfigType = {
    pageKey: undefined,
    enableLinkInput: false,
    enableReplyListModal:false,
    leancloud: {
      appId: "",
      appKey: "",
      serverURL: "",
    },
    admin: {
      name: "",
      email: "",
    },
  };

  // Display status
  ready: boolean = false;

  mounted() {
    // Determine whether use identifier generator or not
    if (this.pagekey === undefined) {
      this.$set(this.configs, "pageKey", getIdentifier().identifierData);
    } else {
      this.$set(this.configs, "pageKey", this.pagekey);
    }
    // Set props
    this.$set(
      this.configs,
      "enableLinkInput",
      this.enablelinkinput.toString() === "true" ? true : false
    );
    this.$set(
      this.configs,
      "enableReplyListModal",
      this.enableReplyListModal.toString() === "true" ? true : false
    );
    this.$set(this.configs.leancloud, "appId", this.appid);
    this.$set(this.configs.leancloud, "appKey", this.appkey);
    this.$set(this.configs.leancloud, "serverURL", this.serverurl);
    this.$set(this.configs.admin, "name", this.name);
    this.$set(this.configs.admin, "email", this.email);
    // Display component
    this.ready = true;
  }
}
</script>
