function getScrollbarWidth() {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll"; // Force scrollbar
  outer.style.msOverflowStyle = "scrollbar"; // Required for IE/Edge
  document.body.appendChild(outer);

  const inner = document.createElement("div");
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}
document.documentElement.style.setProperty(
  "--scrollbar-width",
  `${getScrollbarWidth()}px`
);

// CSS Stylesheets
import "./assets/stylesheets/globals.css";
import "./assets/stylesheets/utils.css";
import "./assets/stylesheets/screen_layouts.css";

import "./assets/stylesheets/page_header.css";

import "./assets/stylesheets/welcome.css";
import "./assets/stylesheets/products.css";
import "./assets/stylesheets/about.css";
import "./assets/stylesheets/contact.css";

// Shoelace components
import "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
// import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";

// Tool cool range slider
import "toolcool-range-slider/dist/plugins/tcrs-generated-labels.min.js";
import "toolcool-range-slider";

import { setDefaultAnimation } from "@shoelace-style/shoelace/dist/utilities/animation-registry.js";
// Change the default animation for all drawers
setDefaultAnimation("drawer.showEnd", {
  keyframes: [{ transform: "translate(100%)" }, { transform: "translate(0)" }],
  options: {
    duration: 400,
    easing: "cubic-bezier(0.75, 0, 0.175, 1)",
  },
});
setDefaultAnimation("drawer.hideEnd", {
  keyframes: [{ transform: "translate(0)" }, { transform: "translate(100%)" }],
  options: {
    duration: 400,
    easing: "cubic-bezier(0.75, 0, 0.175, 1)",
  },
});
setDefaultAnimation("drawer.overlay.show", {
  keyframes: [{ opacity: "0" }, { opacity: "1" }],
  options: {
    duration: 200,
    easing: "ease",
  },
});
setDefaultAnimation("drawer.overlay.hide", {
  keyframes: [{ opacity: "1" }, { opacity: "0" }],
  options: {
    duration: 200,
    easing: "ease",
  },
});
setDefaultAnimation("dialog.overlay.show", {
  keyframes: [{ opacity: "0" }, { opacity: "1" }],
  options: {
    duration: 200,
    easing: "ease",
  },
});
setDefaultAnimation("dialog.overlay.hide", {
  keyframes: [{ opacity: "1" }, { opacity: "0" }],
  options: {
    duration: 200,
    easing: "ease",
  },
});

// Get all imgs
const images = require.context("./assets/imgs", true);

// App
import Controller from "./Controller.mjs";
import View from "./View.mjs";
import Model from "./Model.mjs";
import DWCjson from "./DWC.json";

new Controller(new Model(DWCjson), new View(images));

// FA icons
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fab, fas);
dom.watch();
