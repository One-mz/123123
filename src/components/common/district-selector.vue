<template>
<div >
	<van-field input-align="right" :label='title' :value="selectedCityShow" required   @click.native="showPopSelection()"
	  :readonly="true" :show-clear="false">
		<van-icon name="close" slot="right-icon"  @click.native="clear()" v-show="selectedCity.length > 0 && !this.$store.state.readOnly"
		  size="18"/>
		<van-icon name="location-o" slot="right-icon"  v-show="selectedCity.length == 0" size="18"/>
	</van-field>
	<div v-transfer-dom="true">
		<van-popup v-model="popShow" position="bottom" round >
			<div class="popup-selector" >
				<group>
					<group-title  slot="title">请选择<span  @click="dismiss($event)" style="float:right;color:#1871D1" >确定</span></group-title>
					<picker :data="cityList" v-model="selected" :fixed-columns="3" :columns="3" ref="locationPicker"
					/>
				</group>
			</div>
		</van-popup>
	</div>
</div>
</template>
<script type="text/javascript">
import httpService from 'components/httpService'
import { mapState } from 'vuex'
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
			selectedCity: [], //存放已选中city
			cityList: [],
			popShow: false,
			selected: [],
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
			let cityName = this.$refs.locationPicker.getNameValues();
			// cityName =  cityName.trim().replaceAll(' ', '/')
			let cityArr = cityName.split(' ')
			cityName = cityArr.join('/')
			let hasFlag = this.selectedCity.find(item => {return item.code == this.selected.filter(e => !!e).join('/')})
			if (hasFlag) {
				return
			}
			let item = {
				name: cityName,
				code: this.selected.filter(e => !!e).join('/')
			}

			this.selectedCity.push(item)

      this.$emit('input', this.selectedCity)
			// console.log('selectedCity', this.selectedCity, this.selectedCityShow)
			// console.log('selectedCity', this.selectedCityShow)
		},
		clear() {
			this.selectedCity = [];

      this.$emit('input', this.selectedCity)
		},
		showPopSelection() {
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
			// this.$emit('input', val)
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

    districtData(val) {
      this.cityList = this.districtData
    },

	},
	computed: {
		selectedCityShow: function () {
			return _.reduce(this.selectedCity, function (sum, n) {
				return sum + ',' + n.name
			}, '').substr(1)
		},

    ...mapState({
      districtData: state => state.travel.districtData
    }),

	},

	mounted: function () {
		let tempArray = [];
		let self = this;

      self.cityList = this.$store.state.travel.districtData
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


	},

}
</script>
