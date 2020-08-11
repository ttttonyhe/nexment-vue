<template>
  <div>
    <div v-if="error">
      <div class="nexment-empty">
        <div><Icons name="commentsError" /></div>
        <p>Nexment 服务错误</p>
        <div class="nexment-error">
          <p>错误诊断</p>
          <p>
            请确认你已经在 LeanCloud 添加了一个名为 [nexment_comments] 的
            Class&nbsp;|&nbsp;
            <a href="https://nexment.ouorz.com" target="_blank">
              参考文档
            </a>
          </p>
        </div>
      </div>
    </div>
    <div v-if="!data">
      <div class="nexment-loading">
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
      <div class="nexment-header">
        <div>
          <h1>{{ data.length }} 条评论</h1>
        </div>
        <div>
          <p>
            驱动来自
            <a
              href="https://github.com/HelipengTony/nexment-vue"
              target="_blank"
            >
              Nexment-Vue
            </a>
          </p>
        </div>
      </div>
      <ul class="nexment-comments-list">
        <div class="nexment-loading-index" v-if="loadingStatus">
          <ContentLoader :speed="2" :width="700">
            <rect x="52" y="8" rx="3" ry="3" width="100%" height="10" />
            <rect x="52" y="30" rx="3" ry="3" width="80%" height="10" />
            <rect x="52" y="56" rx="3" ry="3" width="6" height="38" />
            <rect x="69" y="56" rx="3" ry="3" width="60%" height="6" />
            <rect x="69" y="72" rx="3" ry="3" width="50%" height="6" />
            <rect x="69" y="88" rx="3" ry="3" width="30%" height="6" />
          </ContentLoader>
        </div>
      </ul>
      <ul class="nexment-comments-list">
        <li
          v-for="item in data"
          class="nexment-comments-list-item"
          :key="item.ID"
          :id="item.ID.toString()"
        >
          <div class="nexment-comments-div" @click="handleReplyClick(item)">
            <div class="nexment-comments-avatar">
              <img :src="avatarSrc(item)" />
              <div
                v-if="adminBadge(item.name, item.email)"
                class="nexment-admin-badge"
              >
                <Icons name="admin" />
              </div>
            </div>
            <div class="nexment-comments-title">
              <h5>
                <a :href="item.link" target="_blank" v-html="item.name"></a>
                <span> · </span>
                <b>{{ commentDate(item) }}</b>
                <em class="nexment-reply-icon"><Icons name="reply"/></em>
              </h5>
              <p class="nexment-comments-des">{{ item.tag }}</p>
              <div :class="tagContentClass(item)">
                <VueShowdown :markdown="item.content" />
              </div>
            </div>
          </div>

          <div>
            <ul class="nexment-comments-reply-list">
              <div
                v-for="replyItem in item.replyList"
                class="nexment-comments-list-item-div"
                :key="replyItem.ID"
                :id="replyItem.ID.toString()"
              >
                <li
                  class="nexment-comments-list-item"
                  @click="handleReplyClickReply(replyItem)"
                >
                  <div class="nexment-comments-div">
                    <div class="nexment-comments-avatar">
                      <img :src="avatarSrc(replyItem)" />
                      <div
                        v-if="adminBadge(replyItem.name, replyItem.email)"
                        class="nexment-admin-badge"
                      >
                        <Icons name="admin" />
                      </div>
                    </div>
                    <div class="nexment-comments-title">
                      <h5>
                        <a
                          :href="replyItem.link"
                          target="_blank"
                          v-html="replyItem.name"
                        ></a>
                        <span> · </span>
                        <b>{{ commentDate(replyItem) }}</b>
                        <b
                          v-if="replyItem.hasReplies"
                          class="nexment-comments-replyto"
                        >
                          <span> · </span>
                          {{ replyItem.replyList.length }} 条回复
                          <Icons name="down" />
                        </b>
                        <em class="nexment-reply-icon-reply">
                          <Icons name="reply" />
                        </em>
                      </h5>
                      <div class="nexment-comments-content margin-top-reply">
                        <VueShowdown :markdown="replyItem.content" />
                      </div>
                    </div>
                  </div>
                </li>
                <div
                  v-if="replyItem.hasReplies && modalVisibility[replyItem.OID]"
                >
                  <ReplyModal
                    @close="closeModal"
                    pageKey="NB"
                    :replyToOID="replyItem.OID"
                  />
                </div>
              </div>
            </ul>
          </div>
        </li>
        <div v-if="!data.length" class="nexment-empty">
          <div><Icons name="comments" /></div>
          <p>暂无评论</p>
        </div>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import "../../assets/style/commentslist.scss";
// NOTE: Replace with 'vue' when migrating to Vue 3
import { defineComponent, reactive } from "@vue/composition-api";

// SWRV feature (Composition API required)
import useSWRV from "swrv";
import listFetcher from "../../lib/database/getCommentsList";

// Using require to avoid type error
const ContentLoader = require("vue-content-loader").ContentLoader;

import Icons from "../icons/index.vue";
import md5 from "js-md5";
import { format } from "timeago.js";
import Vue from "vue";
import VueShowdown from "vue-showdown";
import { markDownConfigs } from "../../configs/index";
Vue.use(VueShowdown, markDownConfigs);

import ReplyModal from "../modal/index.vue";

interface stateType {
  [name: string]: any;
  modalVisibility: any;
}

export default defineComponent({
  name: "CommentsList",
  props: ["config"],
  components: {
    ContentLoader,
    Icons,
    ReplyModal,
  },
  setup(props: { config: nexmentConfigType }) {
    const { data, error } = useSWRV("demoPage", listFetcher(props.config));
    return {
      data,
      error,
    };
  },
  data() {
    return {
      message: "fuck",
      loadingStatus: false,
      replyToID: null,
      replyToOID: null,
      replyToName: null,
      randomNumber: 0,
      modalVisibility: [],
    } as stateType;
  },
  methods: {
    closeModal(OID: string) {
      this.$set(this.modalVisibility, OID, false);
    },
    open() {
      const ref: any = this.$refs.modal;
      ref.open();
    },
    handleReplyClick(item: any) {
      this.replyToID = item.ID;
      this.replyToOID = item.OID;
      this.replyToName = item.name;
      this.randomNumber = Math.random();
      window.location.href = "#nexment-comment-area";
    },
    handleReplyClickReply(item: any) {
      if (item.hasReplies) {
        // 深层 data 更新使用 Vue.set
        this.$set(this.modalVisibility, item.OID, true);
      } else {
        this.replyToID = item.ID;
        this.replyToOID = item.OID;
        this.replyToName = item.name;
        this.randomNumber = Math.random();
        window.location.href = "#nexment-comment-area";
      }
    },
    adminBadge(name: string, email: string) {
      if (
        name === this.$props.config.admin.name &&
        email === this.$props.config.admin.email
      ) {
        return true;
      } else {
        return false;
      }
    },
    tagContentClass(item: any) {
      return "nexment-comments-content " + (item.tag ? "" : "margin-top");
    },
    avatarSrc(item: any) {
      return "https://gravatar.loli.net/avatar/" + md5(item.email) + "?d=mp";
    },
    commentDate(item: any) {
      return format(item.date);
    },
  },
});
</script>
