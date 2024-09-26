import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, rename, mkdirSync } from "node:fs";
import { basename, dirname, resolve, join, extname } from "node:path";
import { request, get } from 'node:https';
import { matchData } from './util.mjs';

const targetId = 3;
const targetName = '千年女优';
const videoType = [".mp4"]; // 遍历文件重命名的判断依据
const pageType = 1;// 不同类型的词条有些区别，1-一般，2-带有 官方网站 字段的情况
const typePath = ['anima', 'movie', 'tv'];
// 动画区独有的筛选分类
const categoryArr = ["剧集", "剧场版", "电影"];
const categoryValue = categoryArr[2];
const dir = `local/${typePath[0]}/${targetId}`;
const originDir = `../${dir}`;
const jsonFile = `../${dir}/data.json`;
const filePath = `./demo.html`; // 这个作为分析保持在本地临时数据

const code = "1307394";
const options = {
  hostname: 'movie.douban.com',
  port: 443,
  path: `/subject/${code}/`,
  method: 'GET',
};

// 描述json文件默认数据格式
const defaultData = {
  id: targetId,
  path: dir,
  name: targetName,
  category: categoryValue, // 动画区独有的筛选分类
  ratio: '1080', //分辨率
  poster: '', // 海报
  type: [], // 类型，需要支持搜索，所以单独字段
  region: [], // 地区，需要支持搜索，所以单独字段
  releaseDate: '', //日期，这里只显示最早上映的一个日期，需要支持搜索，所以单独字段
  douban: `https://movie.douban.com/subject/${code}/`, // 豆瓣链接
  msg: [], // 根据爬取获取的信息
  intro: '',//剧情简介
  list: [] // 剧集和电影公用的字段，{ name: '1', type: 'mp4' }
}

// 请求获取数据
const getData = () => {
  const req = request(options, (res) => {
    // console.log('statusCode:', res.statusCode);
    let data = '';
    res.on('data', (d) => { data += d; });

    res.on('end', () => {
      // console.log('end:', data);
      writeFileSync(filePath, data);
      console.log('页面保存到本地 demo.html');
    });

  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

const fileArr = [];
const getFileData = (dir) => {
  const exist = existsSync(dir);
  // 排除不需要遍历的文件夹或文件
  const excludeDir = /^(\.|node_module)/;
  if (!exist) {
    console.error("目录路径不存在");
    return;
  }
  const pa = readdirSync(dir);

  for (let index = 0; index < pa.length; index++) {
    let file = pa[index];
    const pathName = join(dir, file);
    const info = statSync(pathName);
    if (info.isDirectory() && !excludeDir.test(file)) {
      getFileData(pathName);
    } else {
      const fileType = extname(file);
      if (videoType.includes(fileType)) {
        const fullName = basename(file);
        fileArr.push({ path: pathName, name: fullName, type: fileType.substring(1) });
      }
    }
  }
};

// 排序
const dataSort = (arr) => {
  // console.log("初始数组：", arr); // 5,4,3,2,1
  const len = arr.length;
  //一次次遍历，有多少个数就遍历多少次
  for (let i = 0; i < len; i++) {
    //循环两两比较数组中的数字
    for (let j = 0; j < len; j++) {
      const ele1 = arr[j],
        ele2 = arr[j + 1];
      //if判断，如果数组中的当前一个比后一个大，那么两个交换一下位置
      if (ele1 && ele2 && parseFloat(ele1.name) > parseFloat(ele2.name)) {
        var tmp = { ...arr[j] };
        arr[j] = { ...arr[j + 1] };
        arr[j + 1] = tmp;
      }
    }
  }
};

// 读取源文件名称并重新命名
const renameOrigin = () => {
  getFileData(originDir);
  let listData = [];
  if (fileArr.length > 1) {
    listData = fileArr.map(ele => {
      const { name, type } = ele;
      // 重命名格式1处理：xx.xx.S01E01.xx.HD中字[xx]
      const nameReg = /E+\d{2}/g;
      const newNameStr = matchData(name, nameReg);
      const newName = parseFloat(newNameStr.substring(1));
      rename(ele.path, `${originDir}/${newName}.${type}`, (err) => {
        if (err) throw err;
      });

      return { name: `${newName}.${type}`, type };
    });
  } else {
    // 电影这类只有一个视频，统一命名为 1
    listData = fileArr.map(ele => {
      const { type } = ele;
      rename(ele.path, `${originDir}/1.${type}`, (err) => {
        if (err) throw err;
      });

      return { name: `1.${type}`, type };
    });
  }
  // console.log('listData', listData);
}


// 解析数据
const formatPage = (pageType) => {
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
  // console.log('--- infoStr start ---');
  // console.log(infoStr);
  // console.log('--- infoStr end ---');
  if (infoStr) {
    const spanReg = /<span class=+.*?>([\s\S]*?)<br\s*?\/>/g;
    const spanResult = matchData(infoStr, spanReg, true);
    // console.log('--- spanResult start ---');
    // console.log(spanResult);
    // console.log('--- spanResult end ---');
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
      let regionEle = spanResult[4];
      if (pageType == 2) {
        regionEle = spanResult[5]; // 这种情况是有的条目增加一个 官方网站 字段
      }
      const regionSplit = regionEle.split(':');
      const regionContent = regionSplit[1];
      const regionText = regionContent.replace(/\s*/g, "");
      console.log('regionText', regionText)
      const regionStr = regionText.substring(7, regionText.length - 5);
      const region = regionStr.split('/');
      defaultData.region = region;
      // 提取日期，这里注意并不是全部都是统一的位置，需要自己查看
      let dateEle = spanResult[6];
      if (pageType == 2) {
        dateEle = spanResult[7]; // 这种情况是有的条目增加一个 官方网站 字段
      }
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

const formatOrigin = () => {
  getFileData(originDir);
  const listData = fileArr.map(ele => {
    const { name, type } = ele;
    return { name, type };
  });
  if (fileArr.length > 1) {
    dataSort(listData);
  }
  defaultData.list = listData;
  // console.log('defaultData', defaultData);
}

// 保存数据
const saveData = () => {
  formatPage(pageType);
  formatOrigin();

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
//分为三步：先重命名源文件，再获取页面放到本地，最后解析生成json文件。分开单独执行
// renameOrigin()
// getData();
saveData();





