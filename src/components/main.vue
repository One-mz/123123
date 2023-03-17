<template>
	 <div class="vux-demo">
      <h1>共享平台</h1>
      <h2>移动端</h2>
     <group>
       <x-input text-align="right" title="搜索流程" v-model="value">
         <x-icon slot="right" type="search" mini @click="doSearch()" style="position:relative;top:0.3rem">搜索</x-icon>
       </x-input>
     </group>
    </div>
</template>
<script type="text/javascript">
import { XInput, Group, Cell } from 'vux'

export default {
	name: 'main-page',
	data() {
		return {
			value: '',
		}
	},
	components: {
		XInput,
		Group,
		Cell,
	},
	methods: {
		doSearch() {
			console.log(this.value)
		},
	},
	mounted: function() {
		this.$store.dispatch('setHeader', {
			title: '财务共享中心',
		})
	}
}
</script>
