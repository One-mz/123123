<template>
<div>
	<x-input text-align="right" v-model="showSelected" :title="title" :placeholder='placeholderInfo' v-on:click.native="showPopUp()"
	  :show-clear="false" :readonly="true">
		<x-icon slot="right" type="android-close" v-show="!this.$store.state.readOnly" size="18" v-if="showSelected.length > 0" v-on:click.native="clearSelected"></x-icon>
	</x-input>

	<div v-transfer-dom style="position:absolute;z-index:1000">
    <popup v-model="show" height="70vh" >
      <group>
        <group-title  slot="title">
          <span  @click="closeDetail()">关闭详情</span>
          <span style="float:right" @click="dismiss()">确定</span>
        </group-title>
        <flexbox v-if="applyCols && applyCols.length" orient="vertical" style="margin-left: 1%">
          <x-input
            v-for="(item, index) in applyCols"
            :key="index"
            :title="`${item.label} `"
            readonly
            :value="request[item.prop]"
          />
        </flexbox>
        <flexbox v-else orient="vertical" style="margin-left: 1%">
          <x-input title="申请类别 " readonly :value="request.applyCategoryName" />
          <x-input title="申请金额 " readonly :value="request.applyAmount" />
          <x-input title="使用日期 " readonly :value="request.useDate" />
          <x-input title="是由说明 " readonly :value="request.reason" />
        </flexbox>
      </group>
    </popup>
  </div>

	<div v-transfer-dom="true">
		<popup v-model="popShow">
			<div class="popup-selector">
				<group>
					<group-title  slot="title">选择{{title}}<span style="float:right" @click="dismiss()">确定</span></group-title>
					<x-input text-align="right" class="weui-vcode" placeholder="搜索" v-model="criteria"  >
						<x-icon slot="right" type="ios-search" @click="doSearching()"></x-icon>
					</x-input>
					<checklist :max='max' :options="asyncList" ref='checkList' @on-change='getUserId' v-model="asyncListValue"></checklist>
				</group>
				<flexbox v-if="page.totalPages > 1">
					<flexbox-item>
						<x-button type="default" :readonly="!page.hasPre" @click.native="previous()">上一页</x-button>
					</flexbox-item>
					<flexbox-item>
						{{currentPage + '/' + page.totalPages}}
					</flexbox-item>
					<flexbox-item>
						<x-button type="default" :readonly="!page.hasNext" @click.native="next()">下一页</x-button>
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
  XSwitch
} from 'vux'

export default {
	name: 'bpm-apply-formno-selector',
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
	},
	data() {
		return {
			request: {},
			indexArr: [],
			show: false,
			popShow: false,
			asyncList: [],
			asyncListValue: [],
			selectedPageObjectMap: {},
			selectedPageIndexMap: {},
			page: {},
			currentPage: 1,
			showSelected: this.value,
			dept:'',
			deptCode: '',
			criteria: '',
			createdDate: dateFormat(new Date(), 'YYYY-MM-DD'),

      multiSearchMap: [],
		}
	},
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
		defaultListValue: {
			type: Array,
			default() {
				return []
			},
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
		single: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: '',
		},
    isMultiSearch: {
		  type: Boolean
    },
    descKey: {
      type: [String, Object]
    },
    applyCols: {
		  type: Array,
      default: () => []
    }
	},
	methods: {
		/**
		 * @author Aaron Su
		 * @description 选中出差人的用户id,暴露给父组件调用
		 */
		closeDetail() {
			this.show = false
		},
		getUserId(indexArr) {
			this.indexArr = indexArr
			this.indexArr.map(item => {
				if (this.asyncList[item].object) {
					this.request = this.asyncList[item].object
				}
				if (this.showKey === 'formNo') {
					this.show = true
				} else {
					this.show = false
				}
			})
		},


		previous() {
			if (this.currentPage > 1) {
				this.currentPage--
			}
		},
		next() {
			// if (this.currentPage < this.page.totalPages) {
			// 	this.currentPage++
			// }
		},
		showPopUp() {
			if (this.$store.state.readOnly) {
				return
			}
			this.$emit('show-callback','');
			this.popShow = true
			this.loadPage()
			this.asyncList = []
			this.asyncListValue = []
			this.selectedPageObjectMap = {}
			this.selectedPageIndexMap = {}
		},

		loadPage() {
			const self = this
			this.asyncList = []
			this.asyncListValue = []
			let requestParam = {}
			if (this.showKey === 'formNo') {
				requestParam.params =  {
          pageNo: this.currentPage,
          pageSize: 10,
          'dbOrders[0].orderTypeEnum': 'DESC',
          'dbOrders[0].property': 'FORM_NO',
        }
			} else {
				requestParam.params =  {
          pageNo: this.currentPage,
          pageSize: 10,
        }
			}

			if (this.criteria) {
				let key = ''
				if (this.toUpper) {
					key = 'FORM_NO_CENTERLIKE'
				} else {
					key = this.showKey + '_CENTERLIKE'
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
			// console.log('prams', this.varsParams)
			requestParam.params = Object.assign(requestParam.params, this.extraParams)

			let formData = new FormData()
			_.forEach(requestParam.params.vars, function(index, item) {
				formData.append('vars[' + item + ']', index)
			})

			_.forEach(requestParam.params, function(index, item) {
				if (item !== 'vars') {
					formData.append(item, index)
				}
			})

			httpService(this)
				.selectorService(this.requestUrl, formData)
				.then(res => {
          console.log(res,'ressss')
					this.page = res.data || res.data.length

          _.forEach(res.data.result || res.data, (val, key) => {
            const desc = this.descKey ? this.format(this.descKey, val) : '';
            this.asyncList.push({
              key: key + '',
              value: val[this.showKey],
              inlineDesc: desc ? desc : val.userId,
              object: val,
            })
          })

					if (
						this.selectedPageIndexMap[this.currentPage] &&
						this.selectedPageIndexMap[this.currentPage].length > 0
					) {
						this.asyncListValue = this.selectedPageIndexMap[this.currentPage]
					}
				})
		},
		deleteDou(arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == '' || typeof arr[i] == 'undefined') {
					arr.splice(i, 1)
					i--
				}
			}
			return arr
		},

		dismiss() {
			this.criteria = ''
			this.$emit('refreshList')
			this.popShow = false
			this.show = false
			this.selectedPageObjectMap[this.currentPage] = _.clone(
				_.pullAt(this.asyncList, this.asyncListValue),
			)

			this.$store.state.slectedInfo = this.selectedPageObjectMap[
				this.currentPage
			]
			if (this.selectedPageObjectMap[this.currentPage].length == 0) {
				return
			}
			console.log('选中的', this.selectedPageObjectMap[this.currentPage])
			this.$emit('passing-info', this.selectedPageObjectMap[this.currentPage])
			//设置初始部门
			let obj = this.selectedPageObjectMap[this.currentPage];
			let t_showSelected = []
			// let deptNames = obj[0].object.departName ? obj[0].object.departName.split(',') : [];
			// let deptCodes =  obj[0].object.departCode ?  obj[0].object.departCode.split(',') : [];
			let deptNames =[];
			let deptCodes =[];
			// this.deleteDou(t_showSelected)
			// console.log('t_select', t_showSelected)
			let selectedObjects = []
			_.forEach(this.selectedPageObjectMap, (val, key) => {
        let temp  = val ? val : [];
				selectedObjects = _.concat(selectedObjects, temp)
				t_showSelected.push(
					_.reduce(
						val,
						function(sum, o) {
							return sum + ',' + o.value
						},
						'',
					).slice(1),
				)
				deptNames.push(
					_.reduce(
						val,
						function(sum, o) {
							return sum + ',' + o.object.departName
						},
						'',
					).slice(1),
				)
				deptCodes.push(
					_.reduce(
						val,
						function(sum, o) {
							return sum + ',' + o.object.departCode
						},
						'',
					).slice(1),
				)
			})
      if(this.isMultiSearch){
        _.forEach(this.multiSearchMap, (val, key) => {
          if(selectedObjects.filter(item => item['object']['userId'] == val['object']['userId']).length <= 0){
            let temp  = val ? val : [];
            selectedObjects = _.concat(selectedObjects, temp)
            t_showSelected.push(val.value)
            deptNames.push(val.object.departName)
            deptCodes.push(val.object.departCode)
          }
        })
      }
			this.deleteDou(t_showSelected)
			this.deleteDou(deptNames)
			this.deleteDou(deptCodes)
			console.log('this.t_showSelected', t_showSelected)
			this.showSelected = t_showSelected.join(',')
      if(this.isMultiSearch){
        let temp = this.value.split(',');
        let tempSelectedObjects = _.clone(selectedObjects);
        tempSelectedObjects.forEach((item,i) =>{
          if(temp.includes(item['value'])){
            selectedObjects.splice(i, 1);
          }
        })
        t_showSelected = selectedObjects.map(item => item.value);
        deptNames = selectedObjects.map(item => item.object.departName);
        deptCodes = selectedObjects.map(item => item.object.departCode);
        this.showSelected = t_showSelected.join(',')
        if(this.showSelected.length >0){
          this.showSelected = this.value + ',' + this.showSelected
        }else {
          this.showSelected = this.value;
        }
      }
			this.dept = deptNames.join(',')
			this.deptCode = deptCodes.join(',')
			console.log('this.t_showSelected', t_showSelected)


			this.$emit('input', this.showSelected)
			this.$emit('selected-object', selectedObjects)
			this.$emit('dept', this.dept)
			this.$emit('deptcode', this.deptCode)

		},

		doSearching() {
		  if(this.isMultiSearch) {
        this.selectedPageObjectMap[this.currentPage] = _.clone(
          _.pullAt(this.asyncList, this.asyncListValue),
        )
        Object.keys(this.selectedPageObjectMap).map(key =>{
          let arr = this.selectedPageObjectMap[key];
          _.forEach(arr, item =>{
            if(this.multiSearchMap.filter(i => i['object']['userId'] == item['object']['userId']).length <=0){
              this.multiSearchMap.push(item);
            }
          })
        })
        console.log('map.....',this.multiSearchMap);
      }
      this.currentPage = 1;
      this.selectedPageIndexMap = {};
      this.selectedPageObjectMap = {};
			this.loadPage()
		},
		clearSelected() {
			// ;
			this.showSelected = ''
			this.$emit('input', this.showSelected)
			this.$emit('selected-object', [])
		},
    format(str, args) {
      var result = str;
      if (arguments.length > 0) {
        if (arguments.length == 2 && typeof (args) == "object") {
          for (var key in args) {
            if (args[key] != undefined) {
              var reg = new RegExp("({" + key + "})", "g");
              result = result.replace(reg, args[key]);
            }
          }
        }
        else {
          for (var i = 1; i < arguments.length; i++) {
            if (arguments[i] != undefined) {
              //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
              var reg = new RegExp("({)" + i + "(})", "g");
              result = result.replace(reg, arguments[i]);
            }
          }
        }
      }
      return result;
    },
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
    asyncListValue(value) {
      if (this.max === 1 && value.length > 0) {
        this.selectedPageObjectMap = [];
        this.selectedPageIndexMap = [];
      }
    }
	},

	mounted() {
		this.asyncListValue = [...this.asyncListValue, ...this.defaultListValue]
		console.log('当前', this.asyncListValue)
		this.showSelected = this.value
	},
}
</script>
<style type="text/css" scoped>
.popup-selector {
	height: 90vh;
}
</style>
