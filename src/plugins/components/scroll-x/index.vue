<template>
  <div class='scroll-x' :style="{ paddingLeft: grid + 'px', paddingRight: grid + 'px'}">
     <slot></slot> 
  </div>
</template>
<script>
export default {
  props: {
    grid: 10,
  },
}
</script>

<style lang="scss" scoped>
.scroll-x {
  width: 100%;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

