<template>
  <div class='search'>
		<Search
		 	ref='search'
			:autoFixed = 'true'
		/>
  </div>
</template>
<script>
import { Search } from 'vux'
export default {
  components: {
    Search,
	},
	mounted() {
		this.$refs.search.setFocus()
	},
}
</script>

