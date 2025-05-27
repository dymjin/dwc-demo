// *****
// Fuse
// *****
import DWCjson from "./DWC.json";
import Fuse from "fuse.js";

const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // ignoreDiacritics: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ["COLOUR"],
};

const fuse = new Fuse(DWCjson, fuseOptions);

// Change the pattern
const searchPattern = "test";

console.log(fuse.search(searchPattern));

// *****
// Stylesheet
// *****
import "./assets/stylesheets/test.css";

// *****
// Micromodal
// *****
// HTML example
//  <div data-micromodal-trigger="modal-1">test</div>
// <div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
//   <div class="modal__overlay" tabindex="-1" data-micromodal-close>
//     <div
//       class="modal__container"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-1-title"
//     >
//       <header class="modal__header">
//         <h2 class="modal__title" id="modal-1-title">
//           Micromodal
//         </h2>
//         <button
//           class="modal__close"
//           aria-label="Close modal"
//           data-micromodal-close
//         ></button>
//       </header>
//       <main class="modal__content" id="modal-1-content">
//         <p>
//           Try hitting the <code>tab</code> key and notice how the focus stays
//           within the modal itself. Also,
//           <code>esc</code> to close modal.
//         </p>
//       </main>
//       <footer class="modal__footer">
//         <button class="modal__btn modal__btn-primary">Continue</button>
//         <button
//           class="modal__btn"
//           data-micromodal-close
//           aria-label="Close this dialog window"
//         >
//           Close
//         </button>
//       </footer>
//     </div>
//   </div>
// </div>;
import MicroModal from "micromodal";
MicroModal.init();

// *****
// Swiper
// *****
// HTML example
// <div class="swiper">
//   <div class="swiper-wrapper">
//     <div class="swiper-slide">
//       <div class="swiper-zoom-container">
//         <img src="path/to/image1.jpg" />
//       </div>
//     </div>
//     <div class="swiper-slide">
//       <div class="swiper-zoom-container">
//         <img src="./assets/imgs/ballet/ballet_1.jpg" />
//       </div>
//     </div>
//     <div class="swiper-slide">Plain slide with text</div>
//     <div class="swiper-slide">
//       <!-- Override maxRatio parameter -->
//       <div class="swiper-zoom-container">
//         <img src="./assets/imgs/ballet/ballet_2.jpg" data-swiper-zoom="5"/>
//       </div>
//     </div>
//   </div>
// </div>
import Swiper from "swiper";
import { /*Navigation,*/ Pagination, Zoom } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

// init Swiper:
const swiper = new Swiper(".swiper", {
  modules: [/*Navigation ,*/ Pagination, Zoom],
  // Optional parameters
  direction: "horizontal",
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  zoom: {
    // panOnMouseMove: true,
    toggle: true,
    maxRatio: 5,
    // limitToOriginalSize: true,
  },
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

// *****
// Choices
// *****
// HTML example
// <select name="test" id="choices-select"></select>
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.css";
// Pass single element
const element = document.querySelector("#choices-select");
// const choices = new Choices(element);

// Pass reference
//   const choices = new Choices('[data-trigger]');
//   const choices = new Choices('.js-choice');

// Passing options (with default options)
const choices = new Choices(element, {}).setValue([
  "Set value 1",
  "Set value 2",
]);

// *****
// Masonry
// *****
// HTML example

import Masonry from "masonry-layout";
// vanilla JS
// init with element
var grid = document.querySelector(".grid");
var msnry = new Masonry(grid, {
  // options...
  itemSelector: ".grid-item",
  columnWidth: 200,
});

// init with selector
// var msnry = new Masonry(".grid", {
//   // options...
// });
