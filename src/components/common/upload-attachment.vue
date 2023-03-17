<template>
	<div class="uploader-wrapper" style="padding: 1rem 0">
		<template v-if="basFilesList.length">
			<van-cell-group
				inset
				v-for="file in basFilesList"
				:key="file.id"
			>
				<van-panel :title="file.fileName">
					<van-field v-model="file.fileSort" input-align="right" :label="$t('common.formLabel.fileSort')" readonly/>
          <VanDateTime v-model="file.ulDate" :label="$t('common.formLabel.ulDate')" :disabled="true"></VanDateTime>
					<van-field v-model="file.fileSize" input-align="right" :label="$t('common.formLabel.fileSize')" readonly/>
				</van-panel>
			</van-cell-group>
		</template>
		<empty-placeholder v-else />
	</div>
</template>
<script>
import { mapState } from 'vuex'

export default {
	name: 'upload-attachment',
	computed: {
		...mapState({
			taskVars: (state) => state.taskVars,
		}),
		basFilesList() {
			return this.taskVars.basFilesList || []
		},
		readOnly() {
			return this.$store.state.readOnly
		}
	},
}
</script>
