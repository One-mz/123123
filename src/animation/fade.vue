<template>
<transition name="fade" mode="in-out">
	<slot></slot>    
</transition>
</template>
<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

