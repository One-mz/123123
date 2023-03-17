<template>
	<div class="fssc-table">
		<ve-table
			:columns="columns"
			:table-data="tableData"
			:fixed-header="true"
      :border-around="true"
      :border-x="true"
      :border-y="true"
			:max-height="tableProps.maxHeight"
      :style="{width: tableProps.width ? tableProps.width : 'width:100%'}"
		/>
		<div v-if="tableProps.showPagination" class="fssc-table-pagination">
			<ve-pagination
				:total="pagination.total"
				:layout="pagination.layout"
				:pageIndex="pagination.pageNo"
				:pageSize="pagination.pageSize"
				:pageSizeOption="pagination.pageSizeOption"
				@on-page-number-change="pageNumberChange"
				@on-page-size-change="pageSizeChange"
			/>
		</div>
	</div>
</template>
<script>
// reference  https://happy-coding-clans.github.io/vue-easytable/#/en/doc/base/pagination
export default {
	name: 'base-table',
	props: {
		tableProps: {
			type: Object,
			default: () => {},
		},
		displayData: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			tableData: [],
			pagination: {
				total: 0,
				pageNo: 1,
				pageSize: 10,
				pageSizeOption: [10, 30, 50, 100],
				layout: ['total', 'sizer', 'prev', 'pager', 'next', 'jumper'],
			},
		}
	},
  computed: {
    columns() {
      return this.tableProps.columns.map(c => {
        c.key = c.field
        return c
      })
    },
  },
	watch: {
		displayData: {
			handler: function (val) {
				if (this.tableProps.readonly === false) {
					this.tableData = val
				} else {
					this.tableData = [...val]
				}
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		pageNumberChange(pageIndex) {
			this.pagination.pageNo = pageIndex
		},

		pageSizeChange(pageSize) {
			this.pagination.pageSize = pageSize
		},
	},
}
</script>

<style lang="scss">
.fssc-table {
	&-pagination {
		margin: 10px 0;
		text-align: right;
	}
}
</style>
