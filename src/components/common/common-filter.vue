<template>
  <div class='com-filter-wrapper' v-if='meuns.length'>
    <myScrollX>
      <div class="com-filter-list">
        <li class='com-filter-item' v-for='(item, index) in meuns' :key='index' @click='_addFilterStatus(index)'>
          <span>{{item.title}}</span>
          <span class='arrow-wrapper'>
            <span class='arrow arrow-up' v-if='item.sort !== "DEFAULT"' :class="{'arrow-up-active': item.sort === 'ASC'}"></span>
            <span class='arrow arrow-down' v-if='item.sort !== "DEFAULT"' :class="{'arrow-down-active': item.sort === 'DESC'}"></span>
          </span>
        </li>
      </div>
    </myScrollX>
  </div>
</template>
<script>
import myScrollX from 'plugins/components/scroll-x'

export default {
  components: {
    myScrollX,
  },
  props: {
    meuns: {
      required: true,
      type: Array,
    },
  },
  methods: {
    _addFilterStatus(index) {
      this.$emit('reloadFilter', index)
    },
  },
}
</script>
<style lang="scss" scoped>
.com-filter {
  &-wrapper {
    height: 3rem;
    display: flex;
    align-items: center;
    // border-bottom: 1px solid #ccc;
  }
  &-list {
    font-size: 14px;
    color: #919191;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    height: 45px;
    flex-wrap: nowrap;
  }
  &-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 25%;
    text-align: center;
    .arrow-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 4px;
    }
    .arrow {
      flex: 1;
      display: inline-block;
      width: 0;
      height: 0;
      border-width: 3px;
      border-style: solid;
      border-color: transparent;
    }
    .arrow-up {
      border-bottom-color: #7a7c7e; 
      margin-bottom: 2px;
    }
    .arrow-up-active {
      border-bottom-color: #f25b5b; 
    }
    .arrow-down {
      border-top-color: #7a7c7e;
    }
    .arrow-down-active {
      border-top-color: #f25b5b; 
    }
  }
}
</style>

