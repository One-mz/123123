<template>
	<div>
		<van-field
			:value="textShow?showText:' '"
			:is-link="!(disabled|| readonly)"
			readonly
			:label="label"
			:placeholder="placeholder"
			@click="clickField"
			input-align="right"
			:name="name"
			:rules="rules"
			:required="required"
		/>
		<van-popup v-model="showPicker" round position="bottom" get-container="#app">
			<van-picker
				:columns="columns"
				@cancel="showPicker = false"
				@confirm="onConfirm"
				:show-toolbar="true"
			>
				<template slot="option" slot-scope="scope">
					<div @click="clickScope(scope)" class="scope-item">
						{{ scope.text }}
						<div class="scope-item-radio">
							<van-icon name="circle" v-if="!values.includes(scope.value)" color="#1871D1" size="18" />
							<van-icon name="checked" v-if="values.includes(scope.value)" color="#1871D1" size="18" />
						</div>
					</div>
				</template>
			</van-picker>
		</van-popup>
	</div>
</template>
<script>
export default {
	name: 'VantMultiplePicker',
	model: {
		prop: 'value',
		event: 'change',
	},
	props: {
		
		name: String,
		rules: Array,
		required: Boolean,
		disabled: {
			type: Boolean,
			default: false,
		},
		textShow:{
			type: Boolean,
			default: true,
		},
        readonly: {
			type: Boolean,
			default: false,
		},
		replace: {
			type: Object,
			default: () => {
				return { text: 'text', value: 'value' }
			},
			required: false,
		},
		label: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '请选择',
		},
		value: {
			type: [Array, Object, String, Number],
			default: '',
		},
		data: {
			type: Array,
			default: () => [],
		},
		noneTips:String
	},
	data() {
		return {
			showPicker: false, // 弹窗显示
            values:[] //已选中的
		}
	},
	computed: {
		showText() {
            let nameArr = []
            let valueArr 
			if(typeof this.value === 'object'){
				// 数组
				valueArr = this.value
			}else if(typeof this.value === 'string'){
				valueArr = this.value.split(',')
			}
			this.columns.forEach(item => {
                if(valueArr.includes(item.value)){
                    nameArr.push(item.text)
                }
            })
			return nameArr.join(',')
		},
		columns() {
			return this.data.map((item) => {
				return {
					...item,
					text: item[this.replace.text],
					value: item[this.replace.value],
				}
			})
		},
	},
    watch:{
        value(val){
			if(typeof val === 'string'){
            	this.values = val.split(',')
			}else{
				this.values = val
			}
        }
    },
	methods: {
        // 点击选择
        clickScope(scope){
            if(this.values.includes(scope.value)){
               let index =  this.values.findIndex(item=>item.value === scope.value)
               this.values.splice(index,1)
            }else{
                this.values.push(scope.value)
            }
        },
		clickField() {
			if (this.disabled || this.readonly) {
				return
			} else if(!this.data.length) {
				this.$dialog.alert({
					message: this.noneTips || '无选择数据',
					title:'提示'
				})
				return
			} else {
				this.showPicker = true
			}
		},
		onConfirm() {
            // 已选择的列表
            let list = this.columns.filter(item=>{ return this.values.includes(item.value)})
            console.log('list :>> ', list);
            let value = list.map(item=>{
                return item.value
            })
			if(typeof this.value === 'string'){
				value = value.join(',')
			}
            let text = list.map(item=>{
                return item.text
            }).join(',')
			this.showPicker = false
			this.$emit('change', value)
			this.$emit('onConfirm', {text,value})
		},
	},
}
</script>
<style scoped>
.scope-item{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
.scope-item-radio{
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
}
</style>