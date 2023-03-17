import httpService from './httpService'

const ubService = {
  camerascan(service) {
    return new Promise((resolve, reject) => {
      ub.nav.client.camerascan({
        callback: function ({
          data
        }) {
          if(!data){
            return;
          }
          if(data.indexOf("QRCodeLogin") > -1){
            let scanQRCodeLogin = service.scannContentToQRCodeLogin(data);
            resolve(scanQRCodeLogin);
          }else{
            let scaninvoice = service.scannContentToInvoice(data);
            service.checkInvoiceValidate(scaninvoice, function () {}).then(function (invoice) {
              if (!invoice) {
                resolve(scaninvoice)
              } else {
                resolve(invoice)
              }
            })
          }
        }
      })

      resolve()
    })

  },
  openfile(id, name, type) {
    ub.nav.client.openfile({
      data: {
        //url: 'http://www.gov.cn/zhengce/pdfFile/2019_PDF.pdf',
        url: httpService().downPDFFileHttp() + '?id=' + id,
        fileName: name + '.pdf',
        fileSize: '100',
        // fileName: '2019_PDF.pdf',
        // fileSize: '1'
      },
      callback: function (val) {
      }
    })

    resolve()
  },
  reload(reloadUrl) {
    ub.nav.client.locate({
      data: {
        name: reloadUrl
      }
    })
    resolve()
  }

}

export default ubService
