import fs from 'fs';
import https from 'https';

// 同时下载的线程数
const THREADS = 10;

function flatDeep (arr: Array<any>, d = 1): Array<any> {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
               : arr.slice();
};

function httpsGet (url: string, encoding: 'utf8' = 'utf8'): Promise<any> {
  return new Promise(resolve => {
    https.get(url, res => {
      let rawData = '';

      res.setEncoding(encoding);

      res.on('data', chunk => rawData += chunk)

      res.on('end', () => {
        let obj: any

        try {
          obj = JSON.parse(rawData)
          resolve(obj)
        } catch (err) {
          console.error(`JSON 解析出错，可能不存在此文件 ${url}`)
          resolve(null)
        }
      })
    })
  })
}

function writeFile (filepath: string, data: any) {
  return new Promise((resolve, reject) => {
    let str = ''

    try {
      str = JSON.stringify(data)
    } catch (err) {
      console.error(err)
    }

    fs.writeFile(filepath, str, function(err) {
      if (err) {
        console.error(filepath)
        console.error(err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function download (adcode: string = '100000', isFull = false) {
  const BASE = 'https://geo.datav.aliyun.com/areas_v2/bound/'
  const SAVE = './china/'

  let file = `${adcode}.json`
  
  isFull && (file = `${adcode}_full.json`)

  let link = `${BASE}${file}`
  let filePath = `${SAVE}${file}`

  const res = await httpsGet(link)

  if (res) {
    await writeFile(filePath, res)
    console.log(`${filePath} OK`)
  }

  if (isFull && res && Array.isArray(res.features)) {
    return res.features.map((m: any) => m.properties.adcode)
  } else {
    return null
  }
}

// 程序主入口
async function main () {
  const adcodes = ['100000']
  const adcodesMap = Object.create(null)

  while (adcodes.length) {
    const portion = adcodes.splice(0, THREADS)

    await Promise.all(portion.map(adcode => download(adcode, false)))

    const results: any = await Promise.all(portion.map(adcode => download(adcode, true)))

    if (Array.isArray(results)) {
      const newAdcodes = flatDeep(results, Infinity).filter(adcode => adcode && !adcodesMap[adcode])

      adcodes.push(...newAdcodes)
    }

    portion.map(adcode => (adcodesMap[adcode] = true))
  }
}

main()
