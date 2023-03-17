<template>
  <div>
    <!-- <invoice :invoiceData="invoiceData"/> -->
  </div>
</template>
<script>

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'apply-info',
  components: {
    
  },
  props: {
    formData: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      request:{
        formNo:'43'
      }
    }
  },
  computed: {
    ...mapGetters(['departInfo', 'userInfo']),
    ...mapState({
      readOnly: (state) => state.readOnly,
      bizObjectData: (state) => state.bizObjectData,
    }),
    invoiceData(){
      return this.bizObjectData.bizRefInvoices
    }

  },
  watch: {

  },
  created() {

  },


  mounted() {

  },
  methods: {

  }

}
</script>
