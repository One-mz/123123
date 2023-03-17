<template>
	<div>
		<!-- <div v-if="rejectDesc != ''">
			<cell title="" value-align="left">
				<icon type="warn"></icon>说明:{{ rejectDesc }}
			</cell>
		</div>
	 -->
		<van-cell-group inset title="经办人信息">
			<van-field input-align="right" label="归属公司" v-model="form.orgRootName" readonly></van-field>

			<van-field input-align="right" label="部门" readonly
				v-model="form.orgName"></van-field>
			<van-field input-align="right" label="经办人" readonly
				v-model="form.operatorName"></van-field>
			<van-field input-align="right" label="联系方式" readonly
				v-model="form.email"></van-field>
		</van-cell-group>
		<van-cell-group inset title="申请单信息" >
			<van-field input-align="right" label="申请单号" v-model="bpmForm.formNo" readonly></van-field>
			<van-field input-align="right" label="申请日期" readonly v-model="bpmForm.createdDate"></van-field>
			<van-field input-align="right" label="申请状态" readonly v-model="bpmForm.formStateName"></van-field>
		</van-cell-group>
	</div>
</template>
<script>
import httpService from 'components/httpService'
import { Cell, XInput, Group, dateFormat, Selector, Icon } from 'vux'
import flows from 'config/available-flow'
import { Base64 } from '@/utils/base64'

import { mapGetters, mapState, mapActions } from 'vuex'
import _ from 'lodash'

export default {
	name: 'common-head',
	components: { XInput, Group, Cell, Icon, Selector },
	data() {
		return {
			personInfo: false,
			createdDate: dateFormat(new Date(), 'YYYY-MM-DD'),
		
			companyList: [],
			departList: [],
			rejectDesc: '',
			bpmForm:{}
			
		}
	},

	created() {
		
	},
	mounted() {
		// this.userInfo = this.$store.state.bpmInfo.userInfo
		// this.departInfo = this.$store.state.bpmInfo.departInfo
		// if (this.requestId != 'new') {
		// 	if (
		// 		this.$store.state.taskVars &&
		// 		this.$store.state.taskVars.bpmFormMain
		// 	) {
		// 		this.companyName = this.$store.state.taskVars.bpmFormMain.companyName
		// 		this.createdByName =
		// 			this.$store.state.taskVars.bpmFormMain.createdByName
		// 		this.securityName = this.$store.state.taskVars.bpmFormMain.securityName
		// 		if (this.$store.state.taskVars.bpmFormMain.attribute1 !== '') {
		// 			this.rejectDesc = this.$store.state.taskVars.bpmFormMain.attribute1
		// 		}
		// 	}
		// 	setTimeout(() => {
		// 		this.loadUserInfo(this.userInfo)
		// 	}, 1000)
		// } else {
		// 	setTimeout(() => {
		// 		this.loadUserInfo(this.userInfo)
		// 	}, 1000)
		// }
	},
	computed: {
		...mapGetters(['pmNodeId', 'bpmFormStep', 'bpmFormMain', 'userInfo']),
		...mapState({
			bizObjectData: state => state.bizObjectData
		}),
		requestId() {
			return this.$route.params.id
		},

		isDisabled() {
			const { companyCode = '' } = this.bpmFormMain

			// 增加判断，如果当前公司不等于单据的公司，则不允许修改
			const companyStr = this.readCookie('companyCode')
			const cookieCompanyCode = companyStr ? Base64.decode(companyStr) : ''

			if (cookieCompanyCode !== companyCode && companyCode) {
				return true
			}

			return false
		},
		form(){
			const {
				operatorCompanyName='',
				operatorCompanyNo='',
				operatorDeptId='',
				operatorDeptName='',
				operatorName='',
				operatorId='',
				statusName='',
				ecFormNo = '',
				createdDate = '',
				operatorPhoneNo = ''
			} = this.bizObjectData
			return {
				orgRootCode: operatorCompanyNo,
				orgRootName: operatorCompanyName,
				orgName: operatorDeptName,
				orgCode: operatorDeptId,
				createdByName: operatorName,
				operatorName,
				tel: '',
				email: operatorPhoneNo,
				basicUserCode: operatorId,
				basicUserName: operatorName,
				// formStateName:statusName,
				// formNo:ecFormNo,
				createdDate:dateFormat(createdDate, 'YYYY-MM-DD')
			}
		}
	},
	watch: {
		bizObjectData: {
			handler: function (val = {}) {
				this.createdDate = dateFormat(val.createdDate, 'YYYY-MM-DD')
				this.formNo = val.formNo
			},
			deep: true
		},
	
		bpmFormMain: {
			immediate: true,
			handler(val) {
				console.log('val :>> ', val)
			
			

				const { processDefName = '' ,formTitle='',formDetailStatus = '',formNo='',createdDate=''} = val
				this.bpmForm = {
					formStateName:formDetailStatus,
					formNo:formNo,
					createdDate:dateFormat(createdDate, 'YYYY-MM-DD')
				}
				if (this.$store.state.headTitle.indexOf(processDefName) !== -1) {
					this.$store.dispatch('setHeader', {
						title: formTitle ,
					})
				}
			},
		},
		form: {
			deep: true,
			immediate: true,
			handler(val) {
				// this.setOptObj(val)
				console.log('val :>> ', val);
				this.$store.dispatch('setOptObj', val)
			}
		}
	},
	methods: {
	
		setPersonInfo() {
			this.personInfo = !this.personInfo
		},
	},
}
</script>
