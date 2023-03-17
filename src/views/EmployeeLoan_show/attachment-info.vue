<template>
  <div>
    <upload-attachment :passing-file-list="passingFileList"></upload-attachment>
  </div>
</template>

<script>
import UploadAttachment from 'components/common/upload-attachment.vue'
  export default {
    name: "attachment-info",
    data() {
      return {
        passingFileList:{}
      }
    },
    computed: {
      requestId: function() {
        return this.$route.params.id
      },
    },
    props: ['formData'],
    created() {},
    mounted() {
      console.log(this.requestId)
      let form_data = new FormData()
      form_data.append('formNo', this.requestId)
      this.$vux.loading.show();
      this.$httpService().getTaskRefVars(form_data)
        .then(res => {
          this.$vux.loading.hide();
          this.passingFileList=res.body.bpmFormMain
          console.log('parentfilelist',this.passingFileList)
        })
    },
    updated() {},
    methods: {

    },
    components: {
      UploadAttachment
    }
  }
</script>

<style scoped>

</style>
