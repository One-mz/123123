import state from "./state";
import httpService from '@/components/httpService'

export default {

  async getDistrictData({commit}, data) {
    // if (state.districtData && state.districtData.length > 0) return state.districtData;
    // let res = await httpService(data).getDistrictTree()
    // commit('setDistrictData', res.data)
    // return res.data
  }
}