
// 企业微信配置
const config = {
  apiTicketUrl: '/uig-fssc-service/wechat/getSignature',
  // TODO 结合env做成配置化
  corpid: 'ww0144178e2bea31ae', // uat 和正式环境

  jsApiList: [
    'chooseImage', // 拍照或从手机相册中选图接口
    'previewImage', // 预览图片接口
    'previewFile', // 预览文件接口
    'scanQRCode', // 调起企业微信扫一扫接口
    'closeWindow', // 关闭当前网页窗口接口
  ]
}

// wx.config({
//   beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
//   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//   appId: '', // 必填，企业微信的corpID
//   timestamp: '', // 必填，生成签名的时间戳
//   nonceStr: '', // 必填，生成签名的随机串
//   signature: '',// 必填，签名，见 附录-JS-SDK使用权限签名算法
//   jsApiList: [
//     'chooseImage', // 拍照或从手机相册中选图接口
//     'previewImage', // 预览图片接口
//     'previewFile', // 预览文件接口
//     'scanQRCode', // 调起企业微信扫一扫接口
//     'closeWindow', // 关闭当前网页窗口接口
//   ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
// });

export default config
