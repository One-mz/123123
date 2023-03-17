import cloneDeep from 'lodash/cloneDeep'

import isNumber from 'lodash/isNumber'
import isNaN from 'lodash/isNaN'
import assign from 'lodash/assign'
import { toNumber } from 'utils/type-check'
import MathUtil from 'utils/mathUtil'
import Vue from 'vue';


export default {

  partnerListChange(state, {partnerList}) {
    state.partnerList = partnerList
  },
  revertToInit(state) {
  }
}
