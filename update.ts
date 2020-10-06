import fs from 'fs';
import https from 'https';

interface IConfig {
  outFiles: [string, string];
  urls: [string, string];
}

// 配置信息
function Config(adcode: string = '100000'): IConfig {
  const BASE = 'https://geo.datav.aliyun.com/areas_v2/bound/'
  const OUT_DIR = './china'
  const file1 = `${adcode}.json`
  const file2 = `${adcode}_full.json`

  return {
    outFiles: [
      `${OUT_DIR}/${file1}`,
      `${OUT_DIR}/${file2}`
    ],
    urls: [
      `${BASE}${file1}`,
      `${BASE}${file2}`,
    ]
  }
}

function httpsGet (url: string, encoding: 'utf8' = 'utf8'): Promise<any> {
  return new Promise((resolve) => {
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

async function recursive (config: IConfig) {
  const { urls, outFiles } = config

  let url = '', file = '', res: any;

  // 不包含子区域
  url = urls[0]
  file = outFiles[0]
  res = await httpsGet(url)
  if (res) {
    await writeFile(file, res)
    console.log(url)
  }

  // 包含子区域
  url = urls[1]
  file = outFiles[1]
  res = await httpsGet(url)
  if (res) {
    await writeFile(file, res)
    console.log(url)

    const adcodes: Array<string> = res.features.map((m: any) => m.properties.adcode)

    for (const adcode of adcodes) {
      const config = Config(adcode)
      await recursive(config)
    }
  }
}

// 程序主入口
function main () {
  recursive(Config())
}

main()
