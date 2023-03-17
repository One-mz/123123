export default {
	// 提交参数json
	submitData: state => state.submitData,
	transports: state => state.submitData.transports, // 差旅信息
	accommodations: state => state.submitData.accommodations, // 住宿信息
	others: state => state.submitData.others, // 其他信息
	trainings: state => state.submitData.trainings, // 其他信息
	meets: state => state.submitData.meets, // 其他信息
	repasts: state => state.submitData.repasts, // 其他信息
	foods: state => state.submitData.foods, // 餐补
	traffic: state => state.submitData.traffic, //交通补助
	publics: state => state.submitData.publics, // 杂费
	// 简化操作的一些数据
	travelApplicationId: state => state.submitData.travelApplicationId, // 差旅单编号
	traveler: state => state.submitData.travelerNames, // 差旅人
	travelStartDate: state => state.submitData.travelStartDate, // 开始时间
	travelEndDate: state => state.submitData.travelEndDate, // 结束时间
	ta: state => state.ta,
}
