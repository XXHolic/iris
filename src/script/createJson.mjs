import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, rename, mkdirSync } from "node:fs";
import { basename, dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { request, get } from 'node:https';
import { matchData } from './util.mjs';

const targetId = 1;
const targetName = '肖申克的救赎';
const typePath = ['anima', 'movie', 'tv'];
const dir = `local/${typePath[1]}/${targetId}`;
const jsonFile = `../${dir}/data.json`;
const filePath = `./createJson.html`; // 这个作为分析保持在本地临时数据

const options = {
  hostname: 'movie.douban.com',
  port: 443,
  path: '/subject/1292052/',
  method: 'GET',
};

// 描述json文件默认数据格式
const defaultData = {
  id: targetId,
  path: dir,
  name: targetName,
  ratio: '1080', //分辨率
  poster: '', // 海报
  type: [], // 类型，需要支持搜索，所以单独字段
  region: [], // 地区，需要支持搜索，所以单独字段
  releaseDate: '', //日期，这里只显示最早上映的一个日期，需要支持搜索，所以单独字段
  douban: 'https://movie.douban.com/subject/1292052/', // 豆瓣链接
  msg: [], // 根据爬取获取的信息
  intro: '',//剧情简介
  list: [{ name: '1', type: 'mp4' }] // 剧集和电影公用的字段，{ name: '1', type: 'mp4' }
}

// 请求获取数据
const getData = () => {
  const req = request(options, (res) => {
    // console.log('statusCode:', res.statusCode);
    let data = '';
    res.on('data', (d) => { data += d; });

    res.on('end', () => {
      // console.log('end:', data);
      // 不确定的时候就先把信息存在本地看看
      writeFileSync(filePath, data);
    });

  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

// 解析数据
const formatData = () => {
  const str = readFileSync(filePath, 'utf8');
  // 获取宣传海报
  const posterReg = /<div id="mainpic"+.*?>([\s\S]*?)<\/div*?>/g;
  const posterStr = matchData(str, posterReg);
  if (posterStr) {
    const imgReg = /src="([\s\S]*?)"/g;
    const imgStr = matchData(posterStr, imgReg);
    if (imgStr) {
      defaultData.poster = imgStr.substring(5, imgStr.length - 1);
    }
  }

  // 获取导演编剧等描述信息
  const infoReg = /<div id="info">([\s\S]*?)<\/div*?>/g;
  const infoStr = matchData(str, infoReg);
  if (infoStr) {
    const spanReg = /<span class=+.*?>([\s\S]*?)<br \/>/g;
    const spanResult = matchData(infoStr, spanReg, true);
    if (spanResult) {
      defaultData.msg = spanResult;
      // 提取类型，这里注意并不是全部都是统一的位置，需要自己查看
      const typeEle = spanResult[3];
      const typeReg = /property="v:genre">([\s\S]*?)<\/span>/g;
      const typeResult = matchData(typeEle, typeReg, true);
      if (typeResult) {
        // console.log('typeResult', typeResult)
        const typeArr = typeResult.map(ele => {
          const txtReg = /[\u4e00-\u9fa5]+/g
          const txt = matchData(ele, txtReg);
          return txt;
        })
        defaultData.type = typeArr;
      }
      // 提取地区，这里注意并不是全部都是统一的位置，需要自己查看
      const regionEle = spanResult[4];
      const regionStr = regionEle.substring(33, regionEle.length - 6);
      const region = regionStr.split('/');
      defaultData.region = region;
      // 提取日期，这里注意并不是全部都是统一的位置，需要自己查看
      const dateEle = spanResult[6];
      const dateReg = /content="([\s\S]*?)"/g;
      const dateStr = matchData(dateEle, dateReg);
      const numReg = /\d{4}-\d{2}-\d{2}/g;
      const numStr = matchData(dateStr, numReg);
      defaultData.releaseDate = numStr.substring(0, 4);
    }
    // console.log(spanResult)

  }

  // 获取简介 span class="all hidden"
  const summaryReg = /<span property="v:summary"+.*?>([\s\S]*?)<\/span>/g;
  defaultData.intro = matchData(str, summaryReg)

  // console.log(defaultData)
}

// 保存数据
const saveData = () => {
  formatData();

  const foldPath = `../${dir}`;
  if (!existsSync(foldPath)) {
    mkdirSync(foldPath);
  }
  const posterSplit = defaultData.poster.split('.');
  const imgType = posterSplit[posterSplit.length - 1];
  const imgPath = `${foldPath}/poster.${imgType}`;

  // console.log(defaultData)

  if (!existsSync(imgPath)) {
    get(defaultData.poster, (res) => {
      let backData = '';
      res.setEncoding("binary");
      res.on('data', (d) => {
        backData += d;
      });

      res.on('end', () => {
        writeFileSync(imgPath, backData, 'binary', (err) => {
          if (err) {
            console.error(`write fail ${imgPath}`);
          }
        });
      });

    }).on('error', (e) => {
      console.error(e);
    });
  }

  defaultData.poster = `poster.${imgType}`;
  writeFileSync(jsonFile, JSON.stringify(defaultData));
  console.log(`${targetName} 信息 json 文件生成`);
}

// getData();
saveData();





