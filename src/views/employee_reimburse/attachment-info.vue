<template>
  <div>
    <upload-attachment :passing-file-list="passingFileList"></upload-attachment>
  </div>
</template>

<script>
  import UploadAttachment from 'components/common/upload-attachment.vue'

  import { mapGetters } from 'vuex'
  export default {
    name: "attachment-info",
    components: { UploadAttachment },
    data() {
      return {}
    },
    props:{
      passingFileList:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    computed:{
      ...mapGetters(['departInfo'])
    },
    created() {
    },
    mounted() {
      console.log('departInfo',this.departInfo)
    },
    updated() {
    },
    methods: {},
    watch: {},
  }
</script>

