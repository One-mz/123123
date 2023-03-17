let fs = require('fs')
const glob = require('glob')
const path = require('path');
const xlsx = require('node-xlsx')

var arr = []

function start(pathName) {
    // fs.readdir(pathName,{},(err,files)=>{
    const files = fs.readdirSync(pathName)
    files.forEach(item => {
        const filePath = fs.statSync(path.join(pathName, item))
        if (filePath.isDirectory()) {
            start(path.join(pathName, item))
        } else {
            let dataStr = fs.readFileSync(path.join(pathName, item), 'utf-8')
            // let str = '$t(123123123)123123123'
            const reg = /(?<=\$t\(').+(?='\))/gm
            const reg2 = /(?<=\$t\(").+(?="\))/gm
            const reg3 = /(?<=\$t\(`).+(?=`\))/gm
            var matchResult = dataStr.match(reg);
            var matchResult2 = dataStr.match(reg2);
            var matchResult3 = dataStr.match(reg3);
            if (matchResult) {
                arr = [...arr, ...matchResult]
            }
            if (matchResult2) {
                arr = [...arr, ...matchResult2]
            }
            if (matchResult3) {
                arr = [...arr, ...matchResult3]
            }
        }
    })

    // })

}
function getJson(route) {
    start(route.basePath)
    const cnObj = JSON.parse(fs.readFileSync(`src/lang/zh-CN.json`))
    const enObj = JSON.parse(fs.readFileSync(`src/lang/en.json`))
    let translateObj = {}
    // Array.from(new Set(arr))
    return Array.from(new Set(arr)).map(item => {
        return [cnObj[item], enObj[item], item]
    })



    // arr.forEach(item=>{
    //     translateObj[item] = {
    //         cn:cnObj[item],
    //         en:enObj[item],
    //     }
    // })

    // data = JSON.stringify(translateObj)
    // fs.writeFile('../../还款test.json', data, (err, file) => {
    //     if (err) {
    //     return console.log(err)
    //     }
    //     console.log('完成')
    // })
}

function exportFile(route) {

    const list = [
        {
            name: "sheet",
            data: [
                ['字段中文', '字段英文', '下标'],
                ...getJson(route)
            ]
        }
    ]
    const buffer = xlsx.build(list)
    fs.writeFile(`../../${route.name}国际化字段.xlsx`, buffer, (err, file) => {
        if (err) {
            return console.log(err)
        }
        console.log('完成')
    })
}

const routes = [
    {
        name:'测试',
        basePath:'src',
    },
   
]
routes.forEach(item=>{
    arr = []
    exportFile(item)

})
// console.log('data.toString() :>> ', data.toString());