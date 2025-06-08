import "./assets/stylesheets/globals.css";
import "./assets/stylesheets/utils.css";
import "./assets/stylesheets/screen_layouts.css";

import "./assets/stylesheets/page_header.css";

import "./assets/stylesheets/welcome.css";
import "./assets/stylesheets/products.css";
import "./assets/stylesheets/about.css";
import "./assets/stylesheets/contact.css";

import Controller from "./Controller.mjs";
import View from "./View.mjs";
import Model from "./Model.mjs";
import DWCjson from "./DWC.json";

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fab, fas);
dom.watch();

new Controller(new Model(DWCjson), new View());

import MicroModal from "micromodal";
import "./assets/stylesheets/micromodals.css";

MicroModal.init({
  disableScroll: true,
  disableFocus: true,
  awaitOpenAnimation: true,
  awaitCloseAnimation: true,
  // debugMode: true,
});

import Swiper from "swiper";
import { /*Navigation,*/ Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";
// import "swiper/css/effect-coverflow";
// import "swiper/css/zoom";

// init Swiper:
const swiper = new Swiper(".swiper", {
  modules: [/*Navigation ,*/ Pagination],
  // Optional parameters
  direction: "horizontal",
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  effect: "coverflow",
  // Navigation arrows
  //   navigation: {
  //     nextEl: ".swiper-button-next",
  //     prevEl: ".swiper-button-prev",
  //   },

  // And if we need scrollbar
  //   scrollbar: {
  //     el: ".swiper-scrollbar",
  //   },
});


// import Choices from "choices.js";
// import "choices.js/public/assets/styles/choices.css";
// // Pass single element
// const element = document.querySelector("#choices-select");
// // const choices = new Choices(element);

// // Pass reference
// //   const choices = new Choices('[data-trigger]');
// //   const choices = new Choices('.js-choice');

// // Passing options (with default options)
// const choices = new Choices(element, {}).setValue([
//   "Set value 1",
//   "Set value 2",
// ]);
