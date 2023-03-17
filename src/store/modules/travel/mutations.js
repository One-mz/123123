export default {

  setDistrictData(state, payload){
    state.districtData = payload
    state.CityData = payload
    .filter((e) => e.parent === null)
    .concat(
      payload.filter((e) =>
        payload
          .filter((e) => e.parent === null)
          .some((i) => i.value === e.parent),
      ),
    )
  }
}