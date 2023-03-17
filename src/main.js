// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Cookies from 'js-cookie'
import FastClick from 'fastclick'
// import mandMobile from 'mand-mobile'
// import 'mand-mobile/lib/mand-mobile.css'
import "vue-easytable/libs/theme-default/index.css";
import VueEasytable, { VePagination } from "vue-easytable";

import '@/vant/index'
import 'vant/lib/index.css'
import 'babel-polyfill'
import 'es6-promise'
import 'scss/main.scss'

import App from './App'
import Ajax from 'plugins/components/ajax'
import router from '@/router'
import Big from 'big.js/big.mjs';

import { AlertPlugin, ConfirmPlugin, LoadingPlugin, ToastPlugin } from 'vux'
import CommonFunction from '@/components/common/common-function.js'

import { SessionStore } from '@/utils/store'

import { $lodash } from '@/helper';
Vue.prototype.$lodash = $lodash;

import i18n from '@/lang' // internationalization
import store from '@/store';
import uploader from 'plugins/components/uploader';
import httpPlugin from '@/components/common/axios';

import httpService1 from '@/components/httpService'
Vue.prototype.$httpService = httpService1(new Vue())
import VueTouch from 'vue-touch'

import availableFlows from 'config/available-flow';
// 将全局函数当做插件来进行注册
import globalFn from '@/libs/globalFn';

import {MathUtil} from '@/utils/mathUtils'
Vue.prototype.$MathUtil = MathUtil
Vue.prototype.$EventBus = new Vue()


Vue.use(globalFn);
// Vue.use(mandMobile)
Vue.use(VueEasytable);
Vue.use(VePagination);

Vue.use(ToastPlugin);
Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);
Vue.use(LoadingPlugin);
Vue.use(CommonFunction);
Vue.use(Ajax);
Vue.use(uploader, store);
Vue.use(VueTouch);
Vue.use(httpPlugin);
// big.js 解决浮点计算精度问题
Vue.prototype.toFixed = (value, dp = 2) => {
  return Number(Big(isNaN(value)?0:value).toFixed(dp));
};

import VanPopupPicker from 'components/common/van-popup-picker'
import VanDropdown from 'components/common/van-dropdown'
import VanCurrencyInput from 'components/common/van-currency-input.vue'
import VanSelector from 'components/common/van-selector'
import VanDateTime from 'components/common/van-datetime.vue'
import VanBoolean from 'components/common/van-boolean.vue'
import VanMultiplePicker from 'components/common/van-multiple-picker.vue'
import CurrencySelect from 'components/common/currency-selector.vue'
import EmptyPlaceholder from 'components/common/empty-placeholder.vue'

Vue.component('EmptyPlaceholder',EmptyPlaceholder);
Vue.component('VanPopupPicker',VanPopupPicker);
Vue.component('VanDropdown',VanDropdown);
Vue.component('VanCurrencyInput',VanCurrencyInput);
Vue.component('VanSelector',VanSelector);
Vue.component('VanDateTime',VanDateTime);
Vue.component('VanBoolean',VanBoolean);
Vue.component('VanMultiplePicker',VanMultiplePicker);
Vue.component('CurrencySelect',CurrencySelect);

/* ------------------------Vue Global Mixins------------------------------ */
import '@/mixins/globalMixin';

if (SessionStore.get('user')) {
  store.dispatch('setBpmInfo', {
    code: 'userInfo',
    value: SessionStore.get('user'),
  })
}


const judgePath = url => {
  // 统一待办跳转
  // 原路径结构
  // /employeeReimburse/1000YGBX202108260002?procInstId=148177&currentTaskInsId=148296


  // TODO
  return false; // 这边不再使用
  return availableFlows.some(e => {
    let {
      bizType
    } = e;
    return url.includes(bizType);
  })
}

// 全局路由权限
router.beforeEach((to, from, next) => {
	const { getters } = store;
	// var redirect = window.location.href.includes('redirect')

  let userStr = window.localStorage.getItem('user');

  function jumpUrl() {
    if (judgePath(to.fullPath)) {
      console.log('进入处理')
      // 替换为前端路径
      const flow = availableFlows.find(e => {
        let {
          bizType
        } = e;
        return to.fullPath.includes(bizType);
      });

      let {
        bizType = '',
        link = ''
      } = flow;

      link = link.replace('/new', '');
      link = link.replace('/', '');

      let path = to.fullPath.slice(1);
      path = path.replace(bizType, link);

      path = decodeURIComponent(path)
      console.log(path)

      next(path);
    } else {
      // console.log('继续')
      if (to.fullPath === '/') {
        next('/login')
      } else {
        next();
      }
    }
  }

  // 登录之后的处理
	if ((getters.userInfo && getters.userInfo.userName && to.path !== '/login')) {
      jumpUrl();
	} else if (to.fullPath !== '/login/') {
    // 从统一待办跳转
		jumpUrl();
	}

	next();
});

// OCR根路径
Vue.prototype.api_url = process.env.VUE_APP_OCR_API


FastClick.attach(document.body)

Vue.config.productionTip = true
// TODO 暂时打开devtools
Vue.config.devtools = true

i18n.locale = 'zh-CN'

/* eslint-disable no-new */
new Vue({
	store,
	router,
  i18n,
	render: h => h(App),
}).$mount('#app-box')
