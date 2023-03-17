<template>
  <div class='list-wrapper'>
    <sticky :top="-1">
      <!-- <div style='background:#fefefe'>
      <Search
        placeholder = '请输入准确的申请单编号'
        :autoFixed = 'true'
        position="absolute"
        @on-change='changeInputText'
      />
      <com-filter
        :meuns = 'filterList'
        @reloadFilter = 'reloadFilter'
      />
      </div> -->
      <van-search v-model="searchText"   :placeholder="$t('common.tasklist.message.FORM_NO')" />
      
    </sticky>
    <com-filter
        :meuns = 'filterList'
        @reloadFilter = 'reloadFilter'
      />
    <List
      :title="title"
      :url="url"
      @go-process="goToProcess"
      :param="param"
      :filterList = 'filterList'
      :searchText = 'searchText'
      :process="process"
      :customParams="customParams"
    ></List>
  </div>
</template>
<script type="text/javascript">
import comFilter from "../common/common-filter.vue";
import List from "./bpm-list";
import { Search, Sticky } from "vux";
import i18n from '@/lang'
export default {
  name: "task-list-with-filter",
  props: ["title", "url", "param", "process","customParams"],
  data() {
    return {
      filterList: [
        {
          title: '申请时间',
          name: "LAST_UPDATED_DATE",
          sort: "DEFAULT"
        },
        {
          title: '单号',
          name: "FORM_NO",
          sort: "DEFAULT"
        },
        {
          title: '申请人',
          name: "CREATED_BY_NAME",
          sort: "DEFAULT"
        },
        {
          title: '创建时间',
          name: "CREATED_DATE",
          sort: "DEFAULT"
        }
      ],
      currentFilterData: {},
      searchText: '',
    }
  },
  methods: {
    changeInputText(value) {
      this.searchText = value
    },
    reloadFilter(index) {
      this.filterList = this.filterList.map((item, i) => {
        if (index === i) {
          if (item.sort === 'DEFAULT') {
            item.sort = 'ASC'
          } else {
            item.sort = (item.sort === 'ASC'  ? 'DESC' : 'ASC')
          }
          this.currentFilterData = item
        } else {
          item.sort = 'DEFAULT'
        }
        return item
      })
    },
    goToProcess(task) {
      this.$emit("go-process", task);
    },
    /**
     * 跳转到搜索页面
     */
    _actionSearch() {
      // const fullPath = this.$route.fullPath.substr(1);
      // this.$router.push({ path: "search", query: { type: fullPath } });
    }
  },
  components: {
    List,
    comFilter,
    Search,
    Sticky,
  },
  created() {
   this.currentFilterData = this.filterList[0]
  },
};
</script>
<style scoped>
.van-search{
    background-color: #f5f5f5;
}
  .van-search__content{
    border-radius: 6px;
    background-color: #fff;

  }
  .van-search .van-cell{
    padding: 8px 8px 8px 0;
  }
</style>

