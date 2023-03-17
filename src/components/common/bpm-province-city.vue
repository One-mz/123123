<template>
<div class='mt-1 vux-1px-t'>
	<x-input text-align="right" :title='title' v-model="selectedCityShow" required   @click.native="showPopSelection()"
	  :readonly="true" :show-clear="false">
		<x-icon slot="right" type="android-close" @click.native="clear()" v-show="selectedCity.length > 0 && !this.$store.state.readOnly"
		  size="18"></x-icon>
		<x-icon slot="right" type="ios-location-outline" v-show="selectedCity.length == 0" size="18"></x-icon>
	</x-input>
	<div v-transfer-dom="true">
		<popup v-model="popShow" >
			<div class="popup-selector" >
				<group>
					<group-title  slot="title">请选择<span  @click="dismiss($event)" style="float:right;color:#1871D1" >确定</span></group-title>

					<picker :data="cityList" v-model="selected" :fixed-columns="2" :columns="3" ref="locationPicker"
					/>
				</group>
			</div>
		</popup>
	</div>
</div>
</template>
<script type="text/javascript">
import httpService from 'components/httpService'
import {
	TransferDom,
	ChinaAddressV4Data,
	XInput,
	Picker,
	Popup,
	Group,
	GroupTitle
} from 'vux'
export default {
	name: 'bpm-province-city',
	directives: {
		TransferDom,
	},
	data() {
		return {
			selectedCity: [],
			cityList: [],
			popShow: false,
			selected: []
		}
	},
	components: {
		XInput,
		Popup,
		Picker,
		Group,
		GroupTitle
	},
	props: {
		title: {
			type: String,
			required: true
		},
		'multi': {
			type: Boolean,
			required: false,
			default: false
		},
		value: {
			type: [Object, Array, String],
			required: false
		},
    extraData: {
		  type: Array
    }
	},
	methods: {
		dismiss() {
			this.popShow = false;
			let city = this.$refs.locationPicker.getNameValues();
			console.log('city',city)
			city = city.replace('市辖区', '').trim()
			console.log('trim/city',city.split(" "))
			if (city === this.$refs.locationPicker.getNameValues()) {
				city = city.split(" ")[1]?city.split(" ")[1]:city.split(" ")[0]
			}
			if (this.selectedCity.indexOf(city) >= 0) {
				return
			}
			// if(city!==undefined){
				if(this.selectedCity.length >0){
					for(var i=0;i<this.selectedCity.length;i++){
						if(this.selectedCity[i].name == city){
							return
						}
					}
				}
				let item = {
				'name': city,
				code: this.selected[1]
				}
				// console.log('item', item)
				this.selectedCity.push(item)
			// }
		},
		clear() {
			this.selectedCity = [];
			// this.selected = [];
		},
		showPopSelection() {
			console.log('this.selectedCity',this.selectedCity)
			if (this.$store.state.readOnly) {
				return
			}
			if (this.selectedCity.length > 0 && !this.multi) {
				return
			}
			this.popShow = true;
		}
	},
	watch: {
		'selectedCity': function (val) {
			this.$emit('input', val)
		},
		value: function (val) {
			if (val && val.push) {
				//is Array
				this.selectedCity = val
			} else if (val) {
				//is object
				this.selectedCity = [val]
			} else {
				//clear clicked
				this.selectedCity = [];
				this.popShow = false
			}
		},
	},
	mounted: function () {
		let tempArray = [];
		let self = this;
		httpService(this).cityListService()
		.then(
			(res) => {
				tempArray.push({
					parent: 0,
						name: '浙江省',
						value: 25 + ''
				})
				_.forEach(res.body, function (province) {
					if(province.id !=25){
						tempArray.push({
							parent: 0,
							name: province.cnName,
							value: province.id + ''
						})
					}
				})
				return tempArray
			}).then((tempArray) => {
			 let formData = new FormData()
    		// formData.append('params',{
			// 		vars: {
			// 			isActive_EQ: 1
			// 		}
			// 	} )
				formData.append('vars[isActive_EQ]', 1)
			httpService(this).cityService(formData)
			.then(
				(res) => {
					tempArray.push({
							parent: 25+'',
							name: '杭州市',
							value: 8847 + ''
					})
					_.forEach(res.body, function (city) {
						if(city.id != 8847){
							tempArray.push({
								parent: city.provincePkId + '',
								name: city.cnName,
								value: city.id + ''
							})
						}

					})
          if(self.extraData && self.extraData.length > 0){
            self.cityList = [...self.extraData, ...tempArray]
          }else {
            self.cityList = tempArray
          }

          //mounted时候也需要赋值
          if (self.value && self.value.push) {
            //is Array
            this.selectedCity = self.value
          } else if (self.value) {
            //is object
            this.selectedCity = [self.value]
          } else {
            //clear clicked
            this.selectedCity = [];
            this.popShow = false
          }
				})
		})
	},
	computed: {
		selectedCityShow: function () {
			return _.reduce(this.selectedCity, function (sum, n) {
				console.log('n', n)
				return sum + ',' + n.name
			}, '').substr(1)
		}
	}
}
</script>

