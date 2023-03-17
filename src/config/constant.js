// 发票枚举
export const invoiceTypeOptions = [{
    value: '01',
    label: '专票(纸质)',
    fpLabel: ['专票(纸质)'], // 容津OCR返回的 发票类型 描述
  }, {
    value: '03',
    label: '机动车销售统一发票',
    fpLabel: ['机动车销售统一发票'],
  }, {
    value: '04',
    label: '增值税普通发票',
    fpLabel: ['增值税普通发票', '增值税发票卷票'],
  }, {
    value: '05',
    label: '增值税电子普通发票',
    fpLabel: ['增值税电子普通发票'],
  }, {
    value: '06',
    label: '高速公路通行发票',
    fpLabel: ['高速公路通行发票'], // ! 容津中无该类型描述，取共享默认值
  }, {
    value: '07',
    label: '桥、闸通行费发票',
    fpLabel: ['桥、闸通行费发票'], // ! 容津中无该类型描述，取共享默认值
  }, {
    value: '08',
    label: '其他通行费发票',
    fpLabel: ['过路费发票', '客运票'],
  }, {
    value: '09',
    label: '农产品发票',
    fpLabel: ['农产品发票'], // ! 容津中无该类型描述，取共享默认值
  }, {
    value: '10',
    label: '其他发票',
    fpLabel: ['定额发票', '通用机打发票', '医疗票据', '区块链电子发票'], // ? 区块链电子发票暂作为其他发票处理
  }, {
    value: '11',
    label: '通行费电子发票',
    fpLabel: ['通行费电子发票'], // ! 容津中无该类型描述，取共享默认值
  }, {
    value: '17',
    label: '海关缴款书',
    fpLabel: ['海关缴款书'], // ! 容津中无该类型描述，取共享默认值
  }, {
    value: '20',
    label: '增值税电子专用发票',
    fpLabel: ['增值税电子专用发票'],
  }, {
    value: '31',
    label: '航空运输电子客票行程单',
    fpLabel: ['航空运输电子客票行程单'],
  }, {
    value: '32',
    label: '铁路车票',
    fpLabel: ['火车票'],
  }, {
    value: '33',
    label: '注明旅客身份信息的公路、水路等其他客票',
    fpLabel: ['注明旅客身份信息的公路、水路等其他客票'], // ! 容津中无该类型描述，取共享默认值
  }, {
    value: '34',
    label: '未注明旅客身份信息的公路、水路等其他客票',
    fpLabel: ['出租车票']
  }, {
    value: '50',
    label: '二手车销售统一发票',
    fpLabel: ['二手车销售统一发票']
  },
  {
    value: '35',
    label: '形式发票',
    fpLabel: ['形式发票']
  }
]

// 无需验真的发票类型
export const noCheckInvoiceTypeCode = [
  '06', // 高速公路通行发票
  '07', // 桥闸通行费发票
  '08', // 其他通行费发票
  // UIG-FSSC #14192 路桥-发票组件-农产品发票录入界面调整
  // '09', // 农产品发票
  '10', // 其他发票
  '13', // ? 浙能 未知发票类型
  '31', // 航空运输电子客票行程单
  '32', // 铁路车票
  '33', // 注明旅客身份信息的公路、水路等其他客票
  '34', // 未注明旅客身份信息的公路、水路等其他客票
  '35' // 未注明旅客身份信息的公路、水路等其他客票
]

// 需要验真的发票类型
export const checkInvoiceTypeCode = [
  '01', // 增值税专用发票
  '03', // 机动车销售统一发票
  '04', // 增值税普通发票
  '05', // 增值税电子普通发票
  '09', // 农产品发票
  '11', // 通行费电子发票
  '20', // 增值税电子专用发票
  '50' // ? 二手车销售统一发票
]

export const dateFormat = {
  'YMDHms': 'YYYY-MM-DD HH:mm:ss',
  'YMD': 'YYYY-MM-DD'
}

export const prPoRelStatusDict = {
  nonMroPr: 'NON_MRO_PR',
  mroPo: 'MRO_PO',
  sapPo: 'SAP_PO',
  contract: 'CONTRACT',
  no: 'NO'
}
