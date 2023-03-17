<template>
<div id="bpm-search-selector">
	<x-input text-align="right" v-model="showSelected" :title="title" :placeholder='placeholderInfo' v-on:click.native="showPopUp()"
	  :show-clear="false" :readonly="true">
		<x-icon slot="right" type="android-close" v-show="!this.$store.state.readOnly" size="18" v-if="showSelected.length > 0" v-on:click.native="clearSelected"></x-icon>
	</x-input>

	<div v-transfer-dom>
		<popup v-model="popShow" :popup-style="{ zIndex: 1001 }">
			<div class="popup-selector">
				<group>
					<group-title  slot="title">选择{{title}}<span style="float:right" @click="dismiss()">确定</span></group-title>
					<x-input text-align="right" class="weui-vcode" placeholder="搜索" v-model="criteria"  >
						<x-icon slot="right" type="ios-search" @click="doSearching()"></x-icon>
					</x-input>
          <cell primary="content" v-show="selectName" :title="selectTitle" :value="selectName"></cell>
					<checklist style="height: 70vh; overflow: auto" :max='max' :options="asyncList" ref='checkList' @on-change='getUserId' :value="asyncListValue"></checklist>
				</group>

				<flexbox v-if="page.totalPages > 1">
					<flexbox-item>
						<x-button type="default" :readonly="!page.hasPre" @click.native="previous()">上一页</x-button>
					</flexbox-item>
					<flexbox-item>
						{{currentPage + '/' + page.totalPages}}
					</flexbox-item>
					<flexbox-item>
						<x-button class="flex-demo" type="default" :readonly="!page.hasNext" @click.native="next()">下一页</x-button>
					</flexbox-item>
				</flexbox>
			</div>
		</popup>
	</div>
</div>
</template>
<script type="text/javascript">
import httpService from 'components/httpService'
import _ from 'lodash'
import { mapState } from 'vuex'
import {
	TransferDom,
	XInput,
	Popup,
	Group,
	GroupTitle,
	Checklist,
	Flexbox,
  FlexboxItem,
	Range,
	XButton,
	dateFormat,
  XTextarea,
  PopupPicker,
  XSwitch,
  Cell,
  Icon,
} from 'vux'

export default {
	name: 'bpm-selector',
  props: {
  	placeholderInfo: {
  		type: String,
  	},
  	toUpper: {
  		type: Boolean,
  	},
  	max: {
  		type: Number,
  	},
  	title: {
  		type: String,
  		required: true,
  	},
  	requestUrl: {
  		type: String,
  		required: true,
  	},
  	varsParams: {
  		type: Object,
  		default() {
  			return {}
  		},
  	},
  	extraParams: {
  		type: Object,
  		default() {
  			return {}
  		},
  	},
  	showKey: {
  		type: String,
  		required: true,
  	},
  	value: {
  		type: String,
  		default: '',
  	},
    userId: {
      type: String,
      default:'',
    },
    descKey: {
      type: [String, Object]
    }
  },
	directives: {
		TransferDom,
	},
	components: {
		XInput,
		Popup,
		Group,
		GroupTitle,
		Checklist,
		Flexbox,
    FlexboxItem,
		Range,
		XButton,
    XTextarea,
    PopupPicker,
    XSwitch,
    Cell,
    Icon,
	},
	data() {
		return {
			indexArr: [],
			popShow: false,
			asyncList: [],
			asyncListValue: [],
			page: {},
			currentPage: 1,
			showSelected: this.value,
			criteria: '',
			addUser: '',
      storageList: [],
      selectTitle: '已选:',
		}
	},
  computed:{
    selectName() {
      return this.storageList.map(e => e.value).join(',')
    },
    ...mapState({
      formStatus: (state) => state.bizObjectData.formStatus,
    }),
  },
  watch: {
  	currentPage: function(newValue, oldValue) {
  		this.selectedPageObjectMap[oldValue] = _.clone(
  			_.pullAt(this.asyncList, this.asyncListValue),
  		)
  		this.selectedPageIndexMap[oldValue] = _.clone(this.asyncListValue)
  		this.loadPage()
  	},

  	value(val) {
  		this.showSelected = val
  	},
    asyncList(val){
      this.backShow()
    }

  },
  mounted() {
  	this.asyncListValue = [...this.asyncListValue]
  	this.showSelected = this.value ;

    this.$watch('userId', {
      deep: true,
      immediate: true,
      handler(val) {

        let userIdArr = val.split(',')
        let userNameArr = this.value.split(',')

        this.storageList = [];

        userIdArr.map((item,i)=>{
          if(item){
            this.storageList.push({
              key: item,
              value: userNameArr[i]
            })
          }
        })

      },
    })

  },
	methods: {
    // 存储数据
    storageInfo(key,changeArr) {
      // 删除
      if (key) {
        this.storageList = this.storageList.filter(item => item.key !== key)
      } else {
        // 新增
        let newArr = this.asyncList.filter(e => changeArr.includes(e.key))
        this.storageList = _.uniqBy(this.storageList.concat(newArr), 'key');
      }
    },

    //反选
    backShow(){
      //根据存储的反显当页选中的数据
      if(!_.isEmpty(this.storageList) && !this.storageList[0].inlineDesc && this.formStatus === '草稿'){
        this.storageList.map((item,i)=>{
          this.asyncList.map(e=>{
            if(item.key === e.key){
              this.storageList.push(e)
            }
          })
        })
      }
      // _.intersectionWith返回一个包含所有传入数组交集元素的新数组。
      let arr =  _.map(_.intersectionWith(this.storageList,this.asyncList, _.isEqual),'key')
      this.asyncListValue = arr
      this.indexArr = arr
    },

    //选择操作
		getUserId(indexArr) {
      console.log('change', indexArr);
      //获取失选的用户id
      const arr = _.difference(this.indexArr, indexArr)
      if (arr && arr.length) {
        this.storageInfo(arr[0])
      } else {
        this.storageInfo('',indexArr)
      }
      this.asyncListValue = indexArr
			this.indexArr = indexArr
		},

    //分页
		previous() {
			if (this.currentPage > 1) {
				this.currentPage--
			}
		},
		next() {
			if (this.currentPage < this.page.totalPages) {
				this.currentPage++
			}
		},

		showPopUp() {
			if (this.$store.state.readOnly) {
				return
			}
			this.$emit('show-callback','');
			this.popShow = true
			this.loadPage()
			this.asyncList = []
			this.selectedPageObjectMap = {}
			this.selectedPageIndexMap = {}
		},

		loadPage() {
			this.asyncList = []
			let requestParam = {
        params: {
          pageNo: this.currentPage,
          pageSize: 10,
        }
      }

      //搜索参数是否需要转换为大写
			if (this.criteria) {
				let key = ''
				if (this.toUpper) {
					key = 'FORM_NO_CENTERLIKE'
				} else {
					key = this.addUser+this.showKey + '_CENTERLIKE'
				}

				requestParam.params.vars = {}
				requestParam.params.vars[key] = this.criteria
				console.log('this.criteria', this.criteria)
			}

      // 新增参数
			requestParam.params.vars = Object.assign(
				requestParam.params.vars || {},
				this.varsParams,
			)

			requestParam.params = Object.assign(requestParam.params, this.extraParams)
			let formData = new FormData()

      //外部传进来的参数需要加 vars 通过varsParams传进来,循环处理
			_.forEach(requestParam.params.vars, function(index, item) {

				formData.append('vars[' + item + ']', index)
			})
      //普通不需要加vars
			_.forEach(requestParam.params, function(index, item) {
				if (item !== 'vars') {
					formData.append(item, index)
				}

			})

			httpService(this)
				.selectorService(this.requestUrl, formData)
				.then(res => {
					this.page = res.body
					let i = 0
					if ( res.body.result && res.body.result[0] && res.body.result[0].user) {
						this.addUser='user.'
						_.forEach(res.body.result, (val, key) => {
							this.asyncList.push({
								key: val.userId + '',
								value: val.user[this.showKey] ,
								inlineDesc: 'ID：' +val.userId+ '/部门：' + val.departName ,
							})
						})
					}
            this.backShow()
        })
		},

		dismiss() {
			this.criteria = ''
			this.popShow = false
			this.$store.state.slectedInfo = this.storageList

			this.$emit('input', this.selectName)
			this.$emit('selected-object', this.storageList)
		},
		doSearching() {
      this.currentPage = 1;
			this.loadPage()
		},

		clearSelected() {
			this.showSelected = ''
			this.$emit('input', this.showSelected)
			this.$emit('selected-object', [])
      this.storageList = []
		},
	},
}
</script>
<style type="text/css">

#bpm-search-selector .vux-popup-dialog {
  z-index: 1001;
}

</style>
