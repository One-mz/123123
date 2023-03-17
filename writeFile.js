let fs = require('fs')
const glob = require('glob')
const path = require('path');
const xlsx = require('node-xlsx')


const list = xlsx.parse('../../测试国际化字段.xlsx')
let obj = {}
list[0].data.forEach(item=>{
    if(item[0]){
        obj[item[2]] = item[0]
    }
})
console.log('obj :>> ', obj);
fs.writeFile(`./src/lang/zh-CN.json`, JSON.stringify(obj), (err, file) => {
    if (err) {
        return console.log(err)
    }
    console.log('完成')
})