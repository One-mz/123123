<template>
  <div class='container'>
    <aHeader :name='userInfo.userName' :title='$store.state.headTitle'
      v-show="$route.path != '/home' && $route.path != '/'" />
    <div class='content'>
      <!-- <keep-alive> -->
      <router-view ref="requestDetail">
      </router-view>
      <!-- </keep-alive> -->
      <flow-buttons class="footButton" @perform-action="performAction" v-show='btnShow' />
    </div>
    <div v-transfer-dom class="audit">
      <van-dialog v-model="isShowConfirm" @confirm="confirm" round showConfirmButton showCancelButton>
        <van-cell-group :title="title">

          <van-field label="处理意见" required readonly></van-field>

          <van-field type="textarea" v-model="optDesc" class="desc" placeholder="请输入"></van-field>

        </van-cell-group>

      </van-dialog>
    </div>
  </div>
</template>
<script>
import {
  Cell,
  Group,
  Popup,
  Tabbar,
  TabbarItem,
  TransferDom,
  XButton,
  Confirm,
  XInput,
  PopupPicker,
  Radio,
  XTextarea,
  Actionsheet
} from 'vux'
import {
  mapGetters
} from 'vuex'
import aHeader from 'plugins/components/a-header'
import FlowButtons from './flow-buttons.vue'
import DraftPng from '@/assets/icon/draft.png'
import CompletePng from '@/assets/icon/complete.png'
import BacklogPng from '@/assets/icon/backlog.png'
import _ from 'lodash'
import httpService from './httpService'
import { Base64 } from '@/utils/base64'
import {
  SessionStore
} from '@/utils/store'
import BpmDropdown from './common/bpm-dropdown.vue'
import VanPopupPicker from 'components/common/van-popup-picker'

const searchPath = ['draft', 'todo', 'done']
export default {
  directives: {
    TransferDom,
  },
  components: {
    XButton,
    Group,
    Cell,
    Popup,
    Tabbar,
    TabbarItem,
    FlowButtons,
    aHeader,
    Confirm,
    XInput,
    PopupPicker,
    Radio,
    BpmDropdown,
    XTextarea,
    Actionsheet,
    VanPopupPicker
  },
  computed: {
    ...mapGetters(['userInfo', 'bpmFormMain', 'departInfo']),
    btnShow() {
      return this.$route.params.id != null && this.$store.state.isShowTabs
    },

  },
  data() {
    return {
      DraftPng,
      CompletePng,
      BacklogPng,
      resetFlowUrl: ['/', '/draft', '/todo', '/done', '/home'],
      show: true,
      isShowConfirm: false,
      action: '',
      optDesc: '',
      title: '审批意见',
      specialRejectFlag: '', //流程选择

      // 常用批示语
      messageList: [],
      showPicker: false,
      attachmentMarkEnumId: '0',
      attachmentMarkRemarks: '',

    }
  },
  methods: {
    async performAction({ action,buttonName }) {


      this.action = action;

      try {
        // 需要填写处理意见的
        this.title = buttonName;
        this.optDesc = ''
        this.isShowConfirm = true;
        return;
      } catch (e) {
        // statements
        console.log('error:', e)
        this.$vux.loading.hide()
        // this.$dialog.alert({
        // 	message: '出现错误:' + JSON.stringify(e),
        //   title: '警告',
        // })
      }
    },


    goToMain() {
      this.$router.replace('/')
      this.$store.dispatch('setCurrentFlow', {
        bizType: '',
        id: '',
      })
      this.$store.dispatch('setFrom', {
        from: '',
      })
    },
    confirm() {
      try {

        if (!this.optDesc) {
          this.$dialog.alert({
            message: '请填写处理意见',
          })
          return;
        }
        this.$httpService.finishStep({
          formNo: this.bpmFormMain.formNo || '',
          optType: this.action,
          remarks: this.optDesc,
        }).then(res => {
          console.log('res :>> ', res);
          const { success = true, message = '' } = res.data
          if (success) {
            this.$dialog.alert({
              message: '处理完成',
            })
            this.$store.dispatch('setCurrentFlow', {
              bizType: '',
              id: '',
            })

            if (this.$store.state.from === 'todo') {
              this.$store.commit('initState', '');
              this.$router.replace('/todo');
            } else if (this.$store.state.from === 'done') {
              this.$store.commit('initState', '');
              this.$router.replace('/done');
            } else if (this.$store.state.from === 'draft') {
              this.$store.commit('initState', '');
              this.$router.replace('/draft');
            } else {
              this.$store.commit('initState', '');
              this.$router.replace('/home');
            }
            this.$store.dispatch('setFrom', {
              from: '',
            })
          } else {
            this.$dialog.alert({
              message
            })
          }
        })

      } catch (error) {
        console.log('error', error)
        this.$dialog.alert({
          message: '操作出现问题！' + JSON.stringify(error),
        })
        return
      }
    },

  },
  mounted: function () {

  },
  watch: {
    '$route.path': function (newVal) {
      if (this.resetFlowUrl.indexOf(newVal) >= 0) {
        // 重置
        this.$store.dispatch('setCurrentFlow', {
          bizType: '',
          id: '',
        })
        this.$store.commit('initState')
        this.$store.commit('revertToInit')
      } else {

      }
    },

  },
}

</script>
<style>
.position-horizontal-demo {
  position: relative;
  height: 80vh;
}

.vux-close {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) scale(4);
  color: #000;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* padding-bottom: 60px; */
}

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 60px;
  background-color: #F6F6F6;
}

.popupMenu {
  padding: 1rem;
  list-style: none;
}

.popup-item {
  height: 3rem;
  font-size: 16px;
}

.footer {
  position: relative !important;
}

.required label::before {
  content: '*';
  color: #C00;
  font-size: 120%;
}


.vux-datetime.required p::before {
  content: '*';
  color: #C00;
  font-size: 120%;
}

.nodot label::before {
  content: '';
}

.scrollable .vux-tab-ink-bar {
  bottom: 0px !important;
}

.scrollable {
  padding-bottom: 0px !important;
}

.audit .weui-dialog {
  z-index: 490
}
</style>
