import { addEventOnce } from './util.js';

const animaCategory = document.querySelector('#animaCategory');
const animaRegion = document.querySelector('#animaRegion');
const animaDate = document.querySelector('#animaDate');
const animaType = document.querySelector('#animaType');
const animaList = document.querySelector('#animaList');

const getList = () => {
  let data = [];
  for (let index = 0; index < 12; index++) {
    data.push({
      id: index + 1,
      name: "火星特快",
      poster: "./demo.jpg",
      type: ['剧情', '爱情', '灾难'],
      region: ['美国'],
      releaseDate: '1997',
    })
  }

  const listStr = data.reduce((acc, cur) => {
    const { id, name, poster, type, region, releaseDate } = cur;
    const eleStr = `<div class="lv-anima-item lv-cp" data-id="${id}">
            <div class="lv-anima-poster"><img src="${poster}" alt="" srcset="" class="lv-anima-img"></div>
            <div class="lv-anima-msg">
              <div class="lv-c2 lv-mb10">${name}</div>
              <div class="lv-mb10">${releaseDate}</div>
              <div class="lv-mb10">${region.join('/')}</div>
              <div>${type.join('/')}</div>
            </div>
          </div>`;
    return acc + eleStr;
  }, '');
  animaList.innerHTML = listStr;
}

const evenInit = () => {
  const animaFilter = document.querySelector('#animaFilter');
  addEventOnce(animaFilter, 'click', (e) => {
    const target = e.target;
    const type = target.getAttribute('data-type');
    // console.log('type', type)
    switch (type) {
      case "category": {
        const activeEle = animaCategory.querySelector('.lv-c2');
        activeEle.setAttribute('class', 'lv-mr10 lv-cp');
        target.setAttribute('class', 'lv-mr10 lv-cp lv-c2');
        break;
      }
      case "region": {
        const activeEle = animaRegion.querySelector('.lv-c2');
        activeEle.setAttribute('class', 'lv-mr10 lv-cp');
        target.setAttribute('class', 'lv-mr10 lv-cp lv-c2');
        break;
      }
      case "date": {
        const activeEle = animaDate.querySelector('.lv-c2');
        activeEle.setAttribute('class', 'lv-mr10 lv-cp');
        target.setAttribute('class', 'lv-mr10 lv-cp lv-c2');
        break;
      }
      case "type": {
        const activeEle = animaType.querySelector('.lv-c2');
        activeEle.setAttribute('class', 'lv-mr10 lv-cp');
        target.setAttribute('class', 'lv-mr10 lv-cp lv-c2');
        break;
      }
    }
  })

  const animaLoad = document.querySelector('#animaLoad');
  addEventOnce(animaLoad, 'click', (e) => {
    let data = [];
    for (let index = 0; index < 6; index++) {
      data.push({
        id: index + 12,
        name: "火星特快12",
        poster: "./demo.jpg",
        type: ['剧情', '爱情', '灾难'],
        region: ['美国'],
        releaseDate: '1997',
      })
    }
    const listStr = data.reduce((acc, cur) => {
      const { id, name, poster, type, region, releaseDate } = cur;
      const eleStr = `<div class="lv-anima-item lv-cp" data-id="${id}">
            <div class="lv-anima-poster"><img src="${poster}" alt="" srcset="" class="lv-anima-img"></div>
            <div class="lv-anima-msg">
              <div class="lv-c2 lv-mb10">${name}</div>
              <div class="lv-mb10">${releaseDate}</div>
              <div class="lv-mb10">${region.join('/')}</div>
              <div>${type.join('/')}</div>
            </div>
          </div>`;
      return acc + eleStr;
    }, '');
    animaList.insertAdjacentHTML('beforeend', listStr);

  })
}

const formatFilter = (data, type) => {
  const ele = data.reduce((acc, cur) => {
    const { id, text } = cur;
    const className = id == -1 ? "lv-mr10 lv-cp lv-c2" : "lv-mr10 lv-cp";
    const str = `<span class="${className}" data-type="${type}">${text}</span>`;
    return acc + str;
  }, '');
  return ele;
}

const getFilter = () => {
  let data = {
    category: [{ id: 1, text: '剧集' }, { id: 2, text: '剧场版' }, { id: 3, text: '电影' }],
    date: [{ id: 1, text: '2024' }, { id: 2, text: '2023' }, { id: 3, text: '2022' }],
    region: [{ id: 1, text: '中国' }, { id: 2, text: '美国' }, { id: 3, text: '日本' }],
    type: [{ id: 1, text: '剧情' }, { id: 2, text: '恐怖' }, { id: 3, text: '搞笑' }],
  };

  const allItem = { id: -1, text: '全部' };
  data.category.unshift(allItem);
  data.date.unshift(allItem);
  data.region.unshift(allItem);
  data.type.unshift(allItem);
  const categoryData = data.category;
  const dateData = data.date;
  const regionData = data.region;
  const typeData = data.type;
  animaCategory.innerHTML = formatFilter(categoryData, 'category');
  animaRegion.innerHTML = formatFilter(dateData, 'region');
  animaDate.innerHTML = formatFilter(regionData, 'date');
  animaType.innerHTML = formatFilter(typeData, 'type');
}

const animaInit = () => {
  getFilter();
  getList();
  evenInit();
}

export { animaInit }