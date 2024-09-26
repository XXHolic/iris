import { showTrigger } from "./util.js";
import { animaInit } from './anima.js';

const init = () => {
  const animaEle = document.querySelector(".lv-anima");
  const movieEle = document.querySelector(".lv-movie");
  const tvEle = document.querySelector(".lv-tv");
  const menuEle = document.querySelector(".lv-left");
  const menuItemEle = document.getElementsByClassName("lv-menu-item");
  const animaMenu = menuItemEle[0],
    movieMenu = menuItemEle[1],
    tvMenu = menuItemEle[2];
  menuEle.addEventListener("click", (e) => {
    const ele = e.target;
    const eleType = ele.getAttribute("data-type");
    switch (eleType) {
      case "anima": {
        animaMenu.setAttribute("class", "lv-menu-item lv-menu-active");
        movieMenu.setAttribute("class", "lv-menu-item");
        tvMenu.setAttribute("class", "lv-menu-item");
        showTrigger.show(animaEle, [movieEle, tvEle]);
        animaInit();
        break;
      }
      case "movie": {
        animaMenu.setAttribute("class", "lv-menu-item");
        movieMenu.setAttribute("class", "lv-menu-item lv-menu-active");
        tvMenu.setAttribute("class", "lv-menu-item");
        showTrigger.show(movieEle, [animaEle, tvEle]);
        // singerInit();
        break;
      }
      case "tv": {
        animaMenu.setAttribute("class", "lv-menu-item");
        movieMenu.setAttribute("class", "lv-menu-item");
        tvMenu.setAttribute("class", "lv-menu-item lv-menu-active");
        showTrigger.show(tvEle, [animaEle, movieEle]);
        // songInit();
        break;
      }
    }
  });

  animaInit();
}

export { init };