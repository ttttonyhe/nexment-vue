<template>
    <div>
      <div class="nexment-modal-text">
        <h1>回复列表</h1>
        <p>@{{ replyToName }}</p>
      </div>
      <div class="nexment-reply-container">
        <ul class="nexment-comments-list">
          <li
            class="nexment-comments-list-item"
            :id="replyItem.ID.toString()"
          >
            <div
              class="nexment-comments-div nexment-reply-primary"
              onClick={() => {
                setReplyToID(Props.replyItem.ID);
                setReplyToOID(Props.replyItem.OID);
                setReplyToName(Props.replyItem.name);
                setRandom(Math.random());
                window.location.href = '#nexment-comment-area';
              }}
            >
              <div class="nexment-comments-avatar">
                <img
                  src={
                    'https://gravatar.loli.net/avatar/' +
                    md5(Props.replyItem.email) +
                    '?d=mp'
                  }
                />
                {adminBadge(Props.replyItem.name, Props.replyItem.email)}
              </div>
              <div class="nexment-comments-title">
                <h5>
                  <a href={Props.replyItem.link} target="_blank">{Props.replyItem.name}</a>
                  <span> · </span>
                  <b>{format(Props.replyItem.date)}</b>
                  <em class="nexment-reply-icon">{Icons().reply}</em>
                </h5>
                <p class="nexment-comments-des">{Props.replyItem.tag}</p>
                <div
                  class={
                    'nexment-comments-content ' +
                    (Props.replyItem.tag ? '' : 'margin-top')
                  }
                >
                  <MarkdownView
                    markdown={Props.replyItem.content}
                    options={markDownConfigs}
                  />
                </div>
              </div>
            </div>
            <div>
              <ul class="nexment-comments-reply-list">
                {loadingStatus ? (
                  <div class="nexment-loading">
                    <ContentLoader
                      speed={2}
                      width={100}
                      style={{ width: '100%' }}
                      height={45}
                      backgroundColor="#f3f3f3"
                      foregroundColor="#ecebeb"
                    >
                      <rect
                        x="52"
                        y="8"
                        rx="3"
                        ry="3"
                        width="100%"
                        height="10"
                      />
                      <rect
                        x="52"
                        y="30"
                        rx="3"
                        ry="3"
                        width="80%"
                        height="10"
                      />
                      <circle cx="20" cy="24" r="20" />
                    </ContentLoader>
                  </div>
                ) : (
                  ''
                )}
                {Props.dataContent !== undefined && Props.dataContent.length ? (
                  Props.dataContent.map(item => (
                    <div
                      class="nexment-comments-list-item-div"
                      key={item.ID}
                      id={item.ID.toString()}
                    >
                      <li class="nexment-comments-list-item">
                        <div
                          class="nexment-comments-div"
                          onClick={() => {
                            if (item.hasReplies) {
                              toggleModal(item.OID);
                            } else {
                              setReplyToID(item.ID);
                              setReplyToOID(item.OID);
                              setReplyToName(item.name);
                              setRandom(Math.random());
                              window.location.href = '#nexment-comment-area';
                            }
                          }}
                        >
                          <div class="nexment-comments-avatar">
                            <img
                              src={
                                'https://gravatar.loli.net/avatar/' +
                                md5(item.email) +
                                '?d=mp'
                              }
                            />
                            {adminBadge(item.name, item.email)}
                          </div>
                          <div class="nexment-comments-title">
                            <h5>
                            <a href={item.link} target="_blank">{item.name}</a>
                              <span> · </span>
                              <b>{format(item.date)}</b>
                              {item.hasReplies ? (
                                <b class="nexment-comments-replyto">
                                  <span> · </span>
                                  {item.replyList.length}{' '}
                                  {item.replyList.length > 1
                                    ? 'replies'
                                    : 'reply'}
                                  {Icons().down}
                                </b>
                              ) : (
                                ''
                              )}
                              <em class="nexment-reply-icon">
                                {Icons().reply}
                              </em>
                            </h5>
                            <p class="nexment-comments-des">{item.tag}</p>
                            <div
                              class={
                                'nexment-comments-content ' +
                                (item.tag ? '' : 'margin-top')
                              }
                            >
                              <MarkdownView
                                markdown={item.content}
                                options={markDownConfigs}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Replies */}
                        <div>
                          {// Recursive reply modal
                          item.hasReplies && modalVisibility[item.OID] ? (
                            <Rodal
                              visible={modalVisibility[item.OID]}
                              onClose={() => {
                                handleClose(item.OID);
                              }}
                              duration={0}
                              showMask={false}
                            >
                              <RepliesList
                                key={item.OID}
                                dataContent={item.replyList}
                                replyTo={item.name}
                                pageKey={Props.pageKey}
                                replyToID={item.ID}
                                replyToOID={item.OID}
                                replyToName={item.name}
                                replyItem={item}
                              />
                            </Rodal>
                          ) : (
                            ''
                          )}
                        </div>
                      </li>
                    </div>
                  ))
                ) : (
                  <div class="nexment-empty">
                    <div>{Icons().comments}</div>
                    <p>{Translation.noComments}</p>
                  </div>
                )}
              </ul>
            </div>
          </li>
        </ul>
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

const SweetModal = require('sweet-modal-vue').SweetModal;
const SweetModalTab = require('sweet-modal-vue').SweetModalTab;

import Icons from '../icons/index.vue';
const md5 = require('js-md5');
import { format } from 'timeago.js';
import Vue from 'vue';
import VueShowdown from 'vue-showdown';
import { markDownConfigs } from '../../configs/index';
Vue.use(VueShowdown, markDownConfigs);

export default defineComponent({
  name: 'RepliesList',
  props: ['dataContent','replyTo','pageKey','replyToID','replyToOID','replyToName','replyItem','config','visibilityFunction','replyItem'],
  components: {
    ContentLoader,
    SweetModal,
    SweetModalTab,
    Icons,
  },
  setup(props: { config: nexmentConfigType }) {
    const state = reactive({
      message: 'fuck',
      loadingStatus: false,
      replyToID: null,
      replyToOID: null,
      replyToName: null,
      randomNumber: 0,
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
    handleReplyClick(item: any) {
      this.state.replyToID = item.ID;
      this.state.replyToOID = item.OID;
      this.state.replyToName = item.name;
      this.state.randomNumber = Math.random();
      window.location.href = '#nexment-comment-area';
    },
    handleReplyClickReply(item: any) {
      if (item.hasReplies) {
      } else {
        this.state.replyToID = item.ID;
        this.state.replyToOID = item.OID;
        this.state.replyToName = item.name;
        this.state.randomNumber = Math.random();
        window.location.href = '#nexment-comment-area';
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
      return 'nexment-comments-content ' + (item.tag ? '' : 'margin-top');
    },
    avatarSrc(item: any) {
      return 'https://gravatar.loli.net/avatar/' + md5(item.email) + '?d=mp';
    },
    commentDate(item: any) {
      return format(item.date);
    },
  },
});
</script>
