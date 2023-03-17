<template>
<bpm-selector :requestUrl='requestUrl' :title="title" :showKey="showKey" :varsParams='varsParams'
  :extraParams='extraParams' :defaultListValue='defaultListValue' @input='onInput' v-model="showSelected"
  @selected-object="getCompanies"   @dept="getCompanies1" @deptcode="getCompanies2" :isMultiSearch="isMultiSearch"/>
</template>
<script>
import BpmSelector from '@/components/common/bpm-selector'
import {
	mapGetters
} from 'vuex'

export default {
	components: {
		BpmSelector,
	},
	props: {
		requestUrl: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		defaultListValue: {
			type: Array,
			default () {
				return []
			},
		},
		showKey: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			required: true
		},
    isMultiSearch: {
		  type: Boolean,
      default: false
    }
	},
	data() {
		return {
			showSelected: this.value,
		}
	},
	computed: {
		...mapGetters(['departInfo']),
		varsParams() {
			const self = this
			return {
				isActive_EQ: this.departInfo.isActive,
				companyCode_EQ: this.departInfo.companyCode,
				// userId_EQ:20000614,
				'user.userName_ISNOTNULL':''
			}
		},
	},
	watch: {
		departInfo(newValue) {
			console.log('public', newValue)
		},
		value(val) {
			this.showSelected = val;
		}
	},
	methods: {
		onInput(selected) {
			this.$emit('input', selected)
		},
		getCompanies(str) {
		  this.$emit('selected-object', str);
			// ;
			this.$emit('getCompanies', _.reduce(str, function (sum, n) {
				return sum + ',' + n.object.userId
			}, '').substr(1))
			//this.$emit('getCompanies', str)
		},
		getCompanies1(str){
			this.$emit('getCompanies1', str)
		},
		getCompanies2(str){
			this.$emit('getCompanies2', str)
		}

	},
	created() {
		this.extraParams = {
			'dbOrders[0].orderTypeEnum': 'DESC',
			'dbOrders[0].property': 'userId',
		}
	},
}
</script>
