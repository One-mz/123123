<template>
    <div></div>
</template>
<script>
export default {
	name: 'signature',

	components: {       
	
	},
	data() {
		return {
		
		}
	},

	
	methods: {
	
	},
	mounted() {
		const {token,nonce,timestamp,sign} = this.$route.query
        console.log('token :>> ', token);
        console.log('nonce :>> ', nonce);
        console.log('timestamp :>> ', timestamp);
        console.log('sign :>> ', sign);
		this.$httpService.wxValid({
			token,
			nonce,
			timestamp,
			sign,
			from:'wechat'
		}).then(res=>{
			console.log('res :>> ', res);
			this.$httpService.uiLoginIn({
				userId:Base64.encode(res.data.userId),
				userName:Base64.encode(res.data.userName),
				orgCode:Base64.encode(res.data.orgCode),
				companyCode:Base64.encode(res.data.companyCode),
				userId:Base64.encode(res.data.userId),
				emailAddress:Base64.encode(res.data.emailAddress),
			}).then(result=>{
				console.log('result :>> ', result);
			})
		})
	},
}
</script>

