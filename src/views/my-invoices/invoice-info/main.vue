<template>
    <!-- 开票信息 -->
    <div>
       <group title="开票信息列表">
        <div v-show="companyInvoiceInfo.length === 0">
            <divider>没有开票信息，请到PC端添加</divider>
        </div>
        <van-cell-group inset v-for="(info,index) in companyInvoiceInfo" :key="index">
             <x-input text-align="right" readonly title="公司名称" required  v-model="info.companyName"></x-input>
             <x-input text-align="right" readonly title="公司编码" required  v-model="info.companyCode"></x-input>
             <x-input text-align="right" readonly title="税号" required  v-model="info.taxNumber"></x-input>
             <x-input text-align="right" readonly title="单位地址" required  v-model="info.companyAddr"></x-input>
             <x-input text-align="right" readonly title="电话号码" required  v-model="info.tel"></x-input>
             <x-input text-align="right" readonly title="开户行" required  v-model="info.openBankName"></x-input>
             <x-input text-align="right" readonly title="银行账号" required  v-model="info.bankAccount"></x-input>
             <!-- <hr> -->
        </van-cell-group>
        </group>
      <div>
        <x-button type="primary" style="position: absolute; bottom: 20px; width: 60%; left: 20%" @click.native="$router.go(-1)">返回</x-button>
      </div>
    </div>
</template>
<script>
import httpService from 'components/httpService'
import { XInput, Group, Divider, XButton } from 'vux'
export default {
	components: {
		XInput,
		Group,
		Divider,
    XButton
	},
	data() {
		return {
			companyInvoiceInfo: [],
		}
	},
	mounted: function() {
    var formData = new FormData()
    let companyCode = this.$store.state.bpmInfo.departInfo.companyCode;
    formData.append('vars[companyCode_IN]', companyCode)
    httpService(this)
      .companyRefTaxnum()
      .then(res => {
        console.log('res', res)

        const {
          result = []
        } = res.data;

        this.companyInvoiceInfo = result
      })
	},
}
</script>
