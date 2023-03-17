<template>
  <van-empty :description="emptyText" />
</template>
<script>
export default {
  name: 'emptyPlaceholder',
  props: ['description'],
  computed: {
    emptyText() {
      return this.description || '暂无数据'
    }
  }
}

</script>
<style>
</style>
