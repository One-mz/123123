<template>
<div>
	<x-input text-align="right" v-model="showSelected" :title="title" :placeholder='placeholderInfo' v-on:click.native="showPopUp()"
	  :show-clear="false" :readonly="true">
		<x-icon slot="right" type="android-close" v-show="!this.$store.state.readOnly" size="18" v-if="showSelected.length > 0" v-on:click.native="clearSelected"></x-icon>
	</x-input>
	<div v-transfer-dom style="position:absolute;z-index:1000">
					<popup v-model="show" height="70vh" >
					<group >
						<group-title  slot="title">
							<span  @click="closeDetail()">关闭详情</span>
							<span style="float:right" @click="dismiss()">确定</span>
						</group-title>
						<flexbox orient="vertical" style="margin-left: 1%">
						<x-input title="出差时间 " readonly v-model="request.travelStartDate" />
						<x-input title="至    " readonly v-model="request.travelEndDate" />
						<x-input title="出差类型 " readonly v-model="request.travelCategoryName" />
						<x-input title="预计金额 " readonly v-model="request.estimateCost" />
						<x-input title="出差地点 " readonly :value="request.destination?JSON.parse(request.destination, '').join(','): ''" />
						<x-input title="出差人员 " readonly v-model="request.travelerName" />
              <!-- <x-input title="是否派车 " readonly :value="request.carRequired == 0?'否':'是'" /> -->
						<x-input title="使用次数 " readonly :value="request.attribute1 == ''? '未使用过': request.attribute1" />
						<x-input title="出差事由 " readonly v-model="request.reason"/>
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

					<checklist v-show="criteria == '' && !reap" style="height: 70vh; overflow: auto" :max='max' :options="asyncList" ref='checkList' @on-change='getUserId' v-model="asyncListValue"></checklist>
	                 <checker v-show="criteria == '' && reap" style="height: 70vh; overflow: auto" :max='max' ref='checkList' class="checkList" @on-change='getUserId' selected-item-class="vux-1px" v-model="asyncListValue">
                        <checker-item v-for="item in asyncList" :value="item.key" v-bind:key="item.key">
                            <div>单号: {{item.object.formNo}}</div>
                            <div>出差人: {{item.object.travelerName}}</div>
                            <div>出差类别: {{item.object.travelCategoryName}}</div>
                            <div> 预计花费: {{item.object.estimateCost}}</div>
                        </checker-item>
                    </checker>
          <checklist v-show="criteria != '' && !reap" style="height: 70vh; overflow: auto" :max='max' :options="searchList" ref='searchList' @on-change='getUserId' v-model="searchListValue"></checklist>
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
  XSwitch,
  Checker,
  CheckerItem
} from 'vux'

export default {
	name: 'bpm-selector',
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
	Checker,
    CheckerItem
	},
	data() {
		return {
			request: {},
			indexArr: [],
      searchIndex: [],
			show: false,
			popShow: false,
			asyncList: [],
      searchList: [],//搜索的列表数据
			asyncListValue: [],
      searchListValue:[],//搜索选中的用户数据
			selectedPageObjectMap: {},
			selectedPageIndexMap: {},
			page: {},
			currentPage: 1,
			showSelected: this.value,
			dept:'',
			deptCode: '',
			criteria: '',
			createdDate: dateFormat(new Date(), 'YYYY-MM-DD'),
			addUser:'',
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
	reap : {
		type: Boolean
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
		Array.isArray(indexArr) ? indexArr : (indexArr == '' ? indexArr = [] : indexArr = [indexArr])
      if(!this.criteria){
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
      }else{
        this.searchIndex = indexArr
        this.searchIndex.map(item => {
        	if (this.searchList[item].object) {
        		this.request = this.searchList[item].object
        	}
        	if (this.showKey === 'formNo') {
        		this.show = true
        	} else {
        		this.show = false
        	}
        })
      }

		},
		getCompanies() {
			if (Array.isArray(this.indexArr) && this.asyncList.length) {
				const arr = []
				//const arr1 = []
				this.indexArr.map(item => {
					console.log('item', this.asyncList)
					const userId = this.asyncList.filter(
						(key, index) => index == index,
					)[0].object.userId
					// const departName = this.asyncList.filter(
					// 	(key, index) => index == index,
					// )[0].object.departName
					// //arr1.push(departName)
					// console.log('item2', item)
					return item
				})
				this.$emit('getCompanies', arr.join(','))
			}
		},
		getCompanies1() {
			if (Array.isArray(this.indexArr) && this.asyncList.length) {
				const arr = []
				this.indexArr.map(item => {
					console.log('item', this.asyncList)
					const departName = this.asyncList.filter(
						(key, index) => index == index,
					)[0].object.departName
					//arr1.push(departName)
					console.log('item2', item)
					return item
				})
				this.$emit('getCompanies1', arr.join(','))
			}
		},
		getCompanies2() {
			if (Array.isArray(this.indexArr) && this.asyncList.length) {
				const arr = []
				this.indexArr.map(item => {
					console.log('item', this.asyncList)
					const departName = this.asyncList.filter(
						(key, index) => index == index,
					)[0].object.departCode
					//arr1.push(departName)
					console.log('item2', item)
					return item
				})
				this.$emit('getCompanies2', arr.join(','))
			}
		},
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
			this.asyncListValue = []
			this.selectedPageObjectMap = {}
			this.selectedPageIndexMap = {}
		},

    //换页加载
		loadPage() {
			const self = this
      if(!this.criteria){
        this.asyncList = []
        this.asyncListValue = []
      }else{
        this.searchList = []
        this.searchListValue = []
      }
			let requestParam = {}
			if (this.showKey === 'formNo') {
				requestParam.params =  {
						pageNo: this.currentPage,
						pageSize: 10,
						'dbOrders[0].orderTypeEnum': 'DESC',
						'dbOrders[0].property': 'FORM_NO',
					}
			}else{
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
			// console.log('prams', this.varsParams)

			// console.log('vars', requestParam.params.vars)
			requestParam.params = Object.assign(requestParam.params, this.extraParams)

			let formData = new FormData()
			_.forEach(requestParam.params.vars, function(index, item) {
				// console.log('varssss', item, index)
				formData.append('vars[' + item + ']', index)
			})

			_.forEach(requestParam.params, function(index, item) {
				if (item !== 'vars') {
					formData.append(item, index)
				}
				// console.log('bos', item, index)
			})

			httpService(this)
				.selectorService(this.requestUrl, formData)
				.then(res => {
					this.page = res.body
					let i = 0
					if ( res.body.result && res.body.result[0] && res.body.result[0].user) {
						this.addUser='user.'
						_.forEach(res.body.result, (val, key) => {
              if(!this.criteria){
                this.asyncList.push({
                	key: key + '',
                	value: val.user[this.showKey] ,
                	inlineDesc: 'ID：' +val.userId+ '/部门：' + val.departName ,
                	object: val,
                })
              }else{
                this.searchList.push({
                	key: key + '',
                	value: val.user[this.showKey] ,
                	inlineDesc: 'ID：' +val.userId+ '/部门：' + val.departName ,
                	object: val,
                })
              }
						})
					}else{
						this.addUser=''
						if(res.body.result){
								_.forEach(res.body.result, (val, key) => {
								  const desc = this.descKey ? this.format(this.descKey, val) : '';
                  this.asyncList.push({
                    key: key + '',
                    value: val[this.showKey],
                    inlineDesc: desc ? desc : val.userId ,
                    object: val,
                  })
						})
						}else{
								_.forEach(res.body, (val, key) => {
                  const desc = this.descKey ? this.format(this.descKey, val) : '';
                  this.asyncList.push({
                    key: key + '',
                    value: val[this.showKey],
                    inlineDesc: desc ? desc :val.userId,
                    object: val,
                  })
						})
						}

					}

					// console.log('asyncList',this.asyncList)
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
      //let endArr
      let originalList = _.clone( _.pullAt(this.asyncList, this.asyncListValue))
      let serchListArr = _.clone( _.pullAt(this.searchList, this.searchListValue))
      serchListArr = serchListArr.concat(originalList)
      this.selectedPageObjectMap[this.currentPage] = serchListArr
      this.searchList = []
      this.searchListValue = []
			this.$store.state.slectedInfo = this.selectedPageObjectMap[
				this.currentPage
			]
			if (this.selectedPageObjectMap[this.currentPage].length == 0) {
				return
			}
			console.log('选中的', this.selectedPageObjectMap[this.currentPage],serchListArr)
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
			this.getCompanies()
			this.getCompanies1()
			this.getCompanies2()
			this.$emit('input', this.showSelected)
			this.$emit('selected-object', selectedObjects)
			this.$emit('dept', this.dept)
			this.$emit('deptcode', this.deptCode)
			// this.$emit('')
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
      console.log('选中',value)
      if (this.max === 1 && value.length > 0) {
        this.selectedPageObjectMap = [];
        this.selectedPageIndexMap = [];
      }
    },
    searchListValue(val){
      // let searchData = this.searchList[val[0]]
      // console.log('搜索选中',searchData)
    }
	},
	mounted() {
		this.asyncListValue = [...this.asyncListValue, ...this.defaultListValue]
		console.log('当前', this.asyncListValue)
		this.showSelected = this.value
	},
}
</script>
<style type="text/css" scoped lang="less">
.popup-selector {
	/* height: 90vh; */
}
.checkList {
    display: black;
    margin-bottom: 5px;
    padding: 0 5%;
    width: 100%;

    .vux-checker-item {
        width: 100%;
        padding: 10px;
    }
}
</style>
