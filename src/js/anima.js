import { addEventOnce } from './util.js'

const animaInit = () => {
  const animaFilter = document.querySelector('#animaFilter');
  addEventOnce(animaFilter, 'click', (e) => {
    const target = e.target;
    const type = target.getAttribute('data-type');
    // console.log('type', type)
    switch (type) {
      case "category": {
        const animaCategory = document.querySelector('#animaCategory');
        const activeEle = animaCategory.querySelector('.lv-c2');
        activeEle.setAttribute('class', 'lv-mr10 lv-cp');
        target.setAttribute('class', 'lv-mr10 lv-cp lv-c2');
        break;
      }
      case "region": {
        const animaRegion = document.querySelector('#animaRegion');
        const activeEle = animaRegion.querySelector('.lv-c2');
        activeEle.setAttribute('class', 'lv-mr10 lv-cp');
        target.setAttribute('class', 'lv-mr10 lv-cp lv-c2');
        break;
      }
      case "date": {
        const animaDate = document.querySelector('#animaDate');
        const activeEle = animaDate.querySelector('.lv-c2');
        activeEle.setAttribute('class', 'lv-mr10 lv-cp');
        target.setAttribute('class', 'lv-mr10 lv-cp lv-c2');
        break;
      }
      case "type": {
        const animaType = document.querySelector('#animaType');
        const activeEle = animaType.querySelector('.lv-c2');
        activeEle.setAttribute('class', 'lv-mr10 lv-cp');
        target.setAttribute('class', 'lv-mr10 lv-cp lv-c2');
        break;
      }
    }
  })
}

export { animaInit }