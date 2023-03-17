import { mapActions, mapState, mapGetters } from 'vuex'


export default {
  created() {
    // 打开流程，设定
    this.$store.dispatch('setCurrentFlow', {
      bizType: this.$route.meta.bizType,
      id: this.$route.params.id || 'new',
    })

  },
  mounted() {
    const { bizType } = this.$route.metae

    setTimeout(() => {
      // this.$store.dispatch('setHeader', {
      //   title,
      // })
      if (!this.$store.state.locked) {
        this.loadTaskInfo()
      }
    }, 200);

  },
  computed: {
    ...mapGetters([
      'bpmFormMain',
      'bpmFormStep',
      'bpmDefInfo',
      'bpmDefNodeInfo',
      // 'bpmNodeSetList',
      'bizObjectData',
      'optObj',
      'basicBizObj',
      "userInfo",
    ]),
    taskKeyword() {
      return ''
    },
    bizObjMap() {

      return {
        basicOrgRootCode: this.optObj.orgRootCode || '', // 业务公司代码
        basicOrgRootName: this.optObj.orgRootName || '', // 业务公司名称
        basicOrgCode: this.optObj.orgCode || '', // 业务部门编码
        basicOrgName: this.optObj.orgName || '', // 业务部门名称
        basicUserCode: this.optObj.basicUserCode || '', // 业务用户编码
        basicUserName: this.optObj.basicUserName || '', // 业务用户名称
        taskKeyword: this.taskKeyword // 任务关键字
      }
    }
  },
  watch: {
    // 监听单据业务
    bizObjMap: {
      immediate: true,
      deep: true,
      handler(val) {
        this.modifyBasicBizObj(val)
      }
    }
  },
  methods: {
    ...mapActions({
      // resetBpm: 'workflow/resetBpm',
      setBasicBizObj: 'setBasicBizObj',
      // resetStateBorrowOffset: 'borrowOffset/resetState'
    }),
    modifyBasicBizObj(data) {
      this.setBasicBizObj({
        ...this.basicBizObj,
        ...data
      })
    },

    getUrgencyAppendStr() {
      let appendStr = '';
      if (this.$store.state.taskVars && this.$store.state.taskVars.bpmFormMain) {
        const { urgencyLevel = '' } = this.$store.state.taskVars.bpmFormMain;
        if (urgencyLevel == '2') {
          appendStr = '(特急)';
        } else if (urgencyLevel == '1') {
          appendStr = '(急)';
        }
      }

      return appendStr;
    },
    loadTaskInfo() {
      const bizType = this.$route.meta.bizType
      let formNo = this.$route.params.id
      let targetType = this.$store.state.targetType

      this.$vux.loading.show()
      let formData = {
        formNo: formNo == 'new' ? '' : formNo,
        procInstId: this.$route.query.procInstId || '',
        processDefKey: bizType,
        doFlag: targetType != 'readonly' ? 0 : 1,
      }
      // formData.append('businessType', businessType)
      this.$httpService
        .getTaskRefVars(formData)
        .then((res) => {
          // loading延时退出，避免用户手动点击
          setTimeout(() => {
            this.$vux.loading.hide()
          }, 1000)

          let taskVars = res.body
          this.$store.commit('setLocked', {
            status: true,
          })
          this.$store.dispatch('setTaskVars', {
            stepInfo: taskVars,
          })
          if (taskVars.bizObjectData) {
            this.$store.commit(
              'setShroffAccount',
              taskVars.bizObjectData.shroffAccount,
            )
          }
          this.$store.commit("SET_ISLOADED", true);
        }).catch((err) => {
          console.log(err);
          this.$store.commit("SET_ISLOADED", false);
        })
      // } else {
      // this.getAllFormNodeAndRender(this.$route.params.id)
      // }
    },
    getAllFormNodeAndRender(formNo) {
      this.$httpService
        .getAllFormNode({
          'vars[formNo_EQ]': formNo,
        })
        .then((res) => {
          console.log(res)
          this.renderNodes(res.body)
        })
    },

    renderNodes(data) {
      const self = this

      let staticStepName = [
        '通知开票', // UIG-FSSC #14647 开票申请单的审批环节图中没有“通知开票”节点
        '财务补充信息', // 资产卡片新增流程，独有环节
        '财务审批', // 资产卡片新增流程，独有环节
        '填写付款账户',
        '影像审核',
        '共享审核', // 资产卡片新增流程，独有环节
        '本地补充信息',
        '共享初审',
        '共享复核',
        '付款审核',
        '共享账务处理',
        '资金二级审核',

        // 这两个节点
        // '财务稽核',
        // '等待过账'
      ]

      data = data.map((e) => {
        return {
          ...e,
          participantValue: e.participantValue
            ? JSON.parse(e.participantValue)
            : '',
          auditor: e.auditor ? JSON.parse(e.auditor) : '',
        }
      })

      // 提交单据
      const submitList = data.filter((e) => e.taskDefName === '提交单据')

      // 合理性审批
      const reasonList = _.sortBy(
        data.filter((e) => e.taskDefName === '业务合理性审批'),
        (e) => e.auditIndex,
      ).map((e) => {
        return {
          ...e,
          participantValue: [e.participantValue],
          participantType: [e.participantType],
          auditor: [e.auditor],
        }
      })
      // console.log('合理性审批环节', reasonList);

      // 共享审批环节
      const shareList = []

      staticStepName.forEach((name) => {
        const list = data.filter((e) => e.taskDefName === name)
        // 可能每个环节有多个同名的，合并

        const participantValue = list.map((e) => e.participantValue)
        const participantType = list.map((e) => e.participantType)

        const auditor = list.map((e) => e.auditor)

        if (!_.isEmpty(list)) {
          shareList.push({
            ...list[0],
            participantValue,
            participantType,
            auditor,
          })
        }
      })
      // console.log('共享审批环节', shareList);

      this.totalList = [...submitList, ...reasonList, ...shareList]

      // console.log('排序好的节点', this.totalList);

      // 判断是当前节点
      const currentNode =
        this.totalList.find((e) => e.attribute6 === 'currentTask') || {}

      console.log('当前节点', currentNode && currentNode.taskDefName)
      console.log('当前节点', currentNode)

      if (currentNode && currentNode.taskDefName === '业务合理性审批') {
        let participantValueCode = ''
        let participantValueName = ''
        let participantValueType = ''

        if (currentNode.participantValue) {
          if (_.isArray(currentNode.participantValue[0])) {
            participantValueName = currentNode.participantValue[0]
              .map((e) => e.name)
              .join(',')
            participantValueCode = currentNode.participantValue[0]
              .map((e) => e.code)
              .join(',')
            participantValueType = currentNode.participantValue[0]
              .map((e) => e.type)
              .join(',')
          } else {
            participantValueName = currentNode.participantValue[0].name
            participantValueCode = currentNode.participantValue[0].code
            participantValueType = currentNode.participantValue[0].type
          }
        }

        console.log(
          '业务合理性审批修改字段',
          participantValueCode,
          participantValueName,
          participantValueType,
        )

        this.$store.dispatch('setBpmFormStep', {
          ...this.bpmFormStep,
          participantValueCode,
          participantValueName,
          participantValueType,
        })
      }
    },
  },
}
