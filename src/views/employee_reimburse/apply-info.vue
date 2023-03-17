<template>
  <div>
    <van-cell-group inset :title="$t('bpm.preApply.label.applyForm')">
      <VanDateTime
        v-model="request.useDate"
        :label="$t('bpm.er.consume.label.communicationDate')"
        :readonly="readOnly"
        required
        placeholder="（请选择）"
      />

<!--      <van-field-->
<!--        input-align="right"-->
<!--        :label="$t('bpm.er.travelClaim.table.communionAddress')"-->
<!--        v-model="request.communicationPlace"-->
<!--         :readonly="readOnly"-->
<!--      ></van-field>-->

      <van-field
        input-align="right"
        :label="$t('bpm.er.travelClaim.table.communionTypeName')"
        v-model="request.communicationTypeName"
         :readonly="readOnly"
      ></van-field>

      <van-field
        input-align="right"
        :label="$t('bpm.er.travelClaim.table.communionSide')"
        v-model="request.communicationObject"
         :readonly="readOnly"
      ></van-field>

      <van-field
        input-align="right"
        :label="$t('bpm.er.consume.label.reason')"
        v-model="request.reason"
         :readonly="readOnly"
      ></van-field>

    </van-cell-group>


    <van-cell-group inset :title="$t('bpm.preApply.label.applyCommunication')">
      <VanDateTime
        v-model="comData.communicationDate"
        :label="$t('bpm.er.consume.label.communicationDate')"
        :readonly="readOnly"
        type='date'
        required
        placeholder="（请选择）"
      />

      <van-field
        input-align="right"
        required
        :label="$t('bpm.er.travelClaim.table.communionAddress')"
        v-model="comData.communicationPlace"
         :readonly="readOnly"
      ></van-field>

      <van-field
        input-align="right"
        required
        :label="$t('bpm.er.travelClaim.table.communionTypeName')"
        v-model="comData.communicationTypeName"
         :readonly="readOnly"
      ></van-field>

      <van-field
        input-align="right"
        required
        :label="$t('bpm.er.consume.label.reason')"
        v-model="comData.communicationReason"
         :readonly="readOnly"
      ></van-field>

      <van-field
        input-align="right"
        required
        :label="$t('bpm.preApply.label.participantsCount')"
        v-model="comData.participantsCount"
         :readonly="readOnly"
      ></van-field>

      <van-field
        input-align="right"
        required
        :label="$t('bpm.preApply.label.participantsName')"
        v-model="comData.participantsName"
         :readonly="readOnly"
      ></van-field>


      <van-field
        rows="3"
        type="textarea"
        :label="$t('bpm.preApply.label.communicationDateInconsistentReason')"
        v-model="comData.communicationDateReason"
         :readonly="readOnly"
      ></van-field>

    </van-cell-group>

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
      comData:{
        communicationDate:''
      },
      request:{
        useDate:''
      }
    }
  },
  computed: {
    ...mapGetters(['departInfo', 'userInfo']),
    ...mapState({
      bizObjectData: state => state.bizObjectData,
      bpmInfo: (state) => state.bpmInfo,
      readOnly: (state) => state.readOnly,
      applyInfo: (state) => state.employeeReimburse.applyInfo,
    }),

  },
  watch: {
  },
  created() {

  },


  mounted() {
    this.getApplyInfo()
  },
  methods: {
    getApplyInfo(){
      console.log(this.applyInfo,'applyInfo')
      const {
        communicationTypeCode = '',
        communicationDate = '',
        communicationPlace = '',
        communicationTypeName = '',
        communicationReason = '',
        participantsCount = '',
        participantsName = '',
        communicationDateInconsistentReason = ''
      } = this.bizObjectData

      this.comData = {
        communicationTypeCode,
        communicationDate,
        communicationPlace,
        communicationTypeName,
        communicationReason,
        participantsCount,
        participantsName,
        communicationDateInconsistentReason
      }

      this.request={
        ...this.applyInfo
      }
    },
    doSubmit(action) {
      return new Promise((resolve, reject) => {
        if (action == 'save') return resolve({  ...this.comData })
        resolve({
          ...this.comData
        })
      })
    }
  }

}
</script>
