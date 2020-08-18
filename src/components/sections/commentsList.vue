<template>
  <div>
    <div v-if="error">
      <div class="nexment-empty">
        <div><Icons name="commentsError" /></div>
        <p>{{ getLang("serviceError") }}</p>
        <div class="nexment-error">
          <p>{{ getLang("problemShooting") }}</p>
          <p>
            {{ getLang("problemDes") }}&nbsp;|&nbsp;
            <a href="https://nexment.ouorz.com" target="_blank">
              {{ getLang("documentation") }}
            </a>
          </p>
        </div>
      </div>
    </div>
    <div v-else-if="!data">
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
      <CommentsArea
        :config="config"
        @reloadFunc="changeLoadingStatus"
        :pageKey="config.pageKey"
        :replyTo="replyToID"
        :replyToOID="replyToOID"
        :replyToName="replyToName"
        :primaryReplyTo="undefined"
        :primaryReplyToOID="undefined"
        :primaryReplyToName="undefined"
        @resetFunc="resetReply"
        @refetchFunc="refetchData"
      />
      <div class="nexment-header">
        <div>
          <h1>{{ data.length }} {{ getLang("comments") }}</h1>
        </div>
        <div>
          <p>
            {{ getLang("poweredBy") }}
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
        <div
          class="nexment-loading-index nexment-loading-list"
          v-if="loadingStatus"
        >
          <ContentLoader :speed="2" :width="700" :height="60">
            <rect x="52" y="8" rx="3" ry="3" width="100%" height="10" />
            <rect x="52" y="30" rx="3" ry="3" width="80%" height="10" />
            <circle cx="20" cy="24" r="20" />
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

          <div v-if="item.replyList">
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
                          {{ replyItem.replyList.length }}&nbsp;{{
                            replyItem.replyList.length > 1
                              ? getLang("replies")
                              : getLang("reply")
                          }}
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
                    :pageKey="config.pageKey"
                    :replyToOID="replyItem.OID"
                    :replyToID="replyItem.ID"
                    :replyToName="replyItem.name"
                    :replyItem="replyItem"
                    :content="replyItem.replyList"
                    :config="config"
                    @refetchFunc="refetchData"
                  />
                </div>
              </div>
            </ul>
          </div>
        </li>
        <div v-if="!data.length" class="nexment-empty">
          <div><Icons name="comments" /></div>
          <p>{{ getLang("noComments") }}</p>
        </div>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
/** 
  Comments list
*/
import "@/assets/style/commentslist.scss";
// NOTE: Replace with 'vue' when migrating to Vue 3
import { defineComponent, reactive } from "@vue/composition-api";

// SWRV feature (Composition API required)
import useSWRV from "swrv";
import listFetcher from "@/lib/database/getCommentsList";

// Using require to avoid type error
const ContentLoader = require("vue-content-loader").ContentLoader;

// Icons
import Icons from "@/components/icons/index.vue";

// Avatar library
import md5 from "js-md5";

// Date formatting library
import { format } from "timeago.js";

// Reply list component
import ReplyModal from "@/components/modal/index.vue";

// Comment area component
import CommentsArea from "@/components/sections/CommentsArea.vue";

interface stateType {
  [name: string]: any;
  modalVisibility: any;
}

// i18n
import getLang from "@/configs/languages";

export default defineComponent({
  name: "CommentsList",
  props: ["config"],
  components: {
    ContentLoader,
    Icons,
    ReplyModal,
    CommentsArea,
  },
  setup(props: { config: nexmentConfigType }) {
    const { data, error, mutate } = useSWRV(
      props.config.pageKey ? props.config.pageKey : "/",
      listFetcher(props.config)
    );
    return {
      data,
      error,
      mutate,
      getLang,
    };
  },
  data() {
    return {
      message: "fuck",
      loadingStatus: false,
      replyToID: null,
      replyToOID: null,
      replyToName: null,
      modalVisibility: [],
    } as stateType;
  },
  methods: {
    closeModal(OID: string) {
      this.$set(this.modalVisibility, OID, false);
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
    changeLoadingStatus() {
      this.loadingStatus = !this.loadingStatus;
    },
    resetReply() {
      this.replyToID = "";
      this.replyToOID = "";
      this.replyToName = "";
    },
    refetchData() {
      this.mutate();
    },
  },
});
</script>
