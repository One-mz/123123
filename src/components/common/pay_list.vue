<template>
  <div>
    <van-cell-group v-for="(item, index) in payListSetJson" inset :key="item.id">
      <template v-for="(field, i) in labelList">
        <van-currency-input
          v-if="field.type==='Amount'"
          :label="field.label"
          v-model="item[field.prop]"
          :precision="field.precision===undefined ? '2' : field.precision"
          readonly
        ></van-currency-input>
        <VanDateTime
          v-else-if="field.type==='Date'"
          :label="field.label"
          v-model="item[field.prop]"
          disabled
        ></VanDateTime>
        <van-field
          v-else
          :label="field.label"
          v-model="item[field.prop]"
          input-align="right"
          readonly
        ></van-field>
      </template>
    </van-cell-group>
  </div>
</template>

<script>
  export default{
    components:{},
    props: {
      payListSetJson: {
        type: Array,
        default: () => []
      },
      labelList: {
        type: Array,
        default: () => []
      }
    },
    data(){
      return{}
    },
    computed: {
    },
    mounted() {
    }
  }
</script>

<style>
</style>
