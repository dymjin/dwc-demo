// import { setDefaultAnimation } from '@shoelace-style/shoelace/dist/utilities/animation-registry.js';
import Swiper from "swiper";
import { Navigation, /*,*/ Pagination, Parallax, Zoom } from "swiper/modules";
const swiper = new Swiper("[data-category-swiper]", {
  // effect: "fade",
  spaceBetween: 20,
  modules: [Navigation, /* ,*/ Pagination, Parallax],
  centeredSlides: true,
  slidesPerView: "auto",
  speed: 300,
  parallax: true,
  grabCursor: true,
});

const productImgSwiper = new Swiper("[data-product-img-swiper]", {
  modules: [Zoom],
  speed: 300,
  zoom: true,
});

// import Swiper and modules styles
import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/effect-coverflow";
// import "swiper/css/zoom";
// import "swiper/css/parallax";

export default class View {
  constructor(images) {
    this.images = images;
    this.imagePath = (name) => images(name, true);
    this.#init();
    this.cartTimeoutID = undefined;
  }
  #init() {
    this.bindUpdateProductItemQty();

    const productImgModal = this.#getElement('[data-dialog="product-img"]');
    productImgModal
      .querySelector("[data-zoom-img]")
      .addEventListener("click", () => {
        productImgSwiper.zoom.toggle();
      });

    const productZoomBtn = this.#getElement(
      '[data-dialog="product"] [data-zoom-img]'
    );
    productZoomBtn.addEventListener("click", () => {
      productImgSwiper.on("slidesUpdated", () => {
        productImgSwiper.zoom.out();
      });
    });

    const productImg = this.#getElement('[data-dialog="product"] header img');
    productImg.addEventListener("click", () => {
      productImgSwiper.on("slidesUpdated", () => {
        productImgSwiper.zoom.out();
      });
    });

    const colourList = this.#getElement("[data-colour-list]");
    const sizeList = this.#getElement("[data-size-list]");

    const clearSelected = (parent) => {
      [...parent.children].forEach((child) => {
        child.classList.remove("selected");
      });
    };

    colourList.addEventListener("click", (ev) => {
      if (ev.target !== colourList) {
        clearSelected(colourList);
        ev.target.classList.add("selected");
      }
    });

    sizeList.addEventListener("click", (ev) => {
      if (ev.target !== sizeList) {
        clearSelected(sizeList);
        ev.target.classList.add("selected");
      }
    });

    // [...colourList.children].forEach((colour) => {
    //   colour.addEventListener("click", () => {
    //     clearSelected(colourList);
    //     colour.classList.add("selected");
    //   });
    // });

    // [...sizeList.children].forEach((size) => {
    //   size.addEventListener("click", () => {
    //     clearSelected(sizeList);
    //     size.classList.add("selected");
    //   });
    // });
    // console.log(this.imagePath("./test/RAD TP01.jpg"));
    // const openSearch = this.#getElement("[data-open-searchbar]");
    // const searchControls = this.#getElement("[data-search-controls]");
    // openSearch.addEventListener("click", () => {
    //   searchControls.classList.toggle("visible");
    // });

    // init category scroller
    const parallaxBG = this.#getElement("[data-parallax-bg]");

    const updateCategoryBG = (category) => {
      // const parallaxBG = this.#getElement("[data-parallax-bg]");
      // flag = flag ? false : true;

      // console.log(flag);
      // parallaxBG.style.opacity = 0;
      // setTimeout(() => {
      //   parallaxBG.style.opacity = 1;
      // }, 300);
      parallaxBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${this.imagePath(
        `./category_swiper/${category.toLowerCase()}.jpg`
      )}')`;
      // parallaxBG.style.backGroundImage = `${category.title}`
      // bg = category.img
    };

    swiper.on("realIndexChange", function () {
      setTimeout(() => {
        const activeSlide = document.querySelector(".swiper-slide-active");
        if (activeSlide) {
          updateCategoryBG(activeSlide.dataset.category);
        }
      }, 200);
    });
    // swiper.on("slideChangeTransitionStart", function () {
    //   parallaxBG.style.opacity = 0;
    // });
    // swiper.on("slideChangeTransitionEnd", function () {
    //   parallaxBG.style.opacity = 1;
    // });
    // init category scroller

    // observe header
    // update header using intersection observer: https://www.smashingmagazine.com/2021/07/dynamic-header-intersection-observer/
    const header = this.#getElement("[data-page-header]");
    const sections = [...this.#getAllElements("[data-section]")];
    const scrollRoot = this.#getElement("[data-scroller]");
    const pageHeaderTabs = [...this.#getAllElements("[data-tab]")];
    // const sidenavTabs = [
    //   ...this.#getAllChildren(
    //     this.#getElement("[data-sidenav-tabs]"),
    //     "[data-tab]"
    //   ),
    // ];

    let prevYPosition = 0;
    let pagePrevYPos = 0;
    let scrollerDirection = "up";
    let pageDirection = "up";
    const options = {
      root: scrollRoot,
      rootMargin: `${header.offsetHeight * -1}px`,
      threshold: 0,
    };

    const getTargetSection = (entry) => {
      const index = sections.findIndex((section) => section === entry.target);
      if (index >= sections.length - 1) {
        return entry.target;
      } else {
        return sections[index + 1];
      }
    };

    const updateTheme = (target) => {
      const theme = target.id;
      header.setAttribute("data-theme", theme);
    };

    const shouldUpdate = (entry) => {
      if (scrollerDirection === "down" && !entry.isIntersecting) {
        return true;
      }
      if (scrollerDirection === "up" && entry.isIntersecting) {
        return true;
      }
      return false;
    };

    const updateTabMarker = (target) => {
      const id = target.id;
      let headerTab = pageHeaderTabs.find((el) => {
        return el.getAttribute("href") === `#${id}`;
      });
      // let sidenavTab = sidenavTabs.find((el) => {
      //   return el.getAttribute("href") === `#${id}`;
      // });
      headerTab = headerTab || pageHeaderTabs[0];
      // sidenavTab = sidenavTab || sidenavTabs[0];
      pageHeaderTabs.forEach((tab) => {
        tab.removeAttribute("data-active-tab");
      });
      // sidenavTabs.forEach((tab) => {
      //   tab.removeAttribute("data-active-tab");
      // });
      headerTab.dataset.activeTab = "";
      // sidenavTab.dataset.activeTab = "";
    };

    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        scrollerDirection =
          scrollRoot.scrollTop > prevYPosition ? "down" : "up";
        prevYPosition = scrollRoot.scrollTop;
        const target =
          scrollerDirection === "down" ? getTargetSection(entry) : entry.target;

        if (shouldUpdate(entry)) {
          updateTheme(target);
          updateTabMarker(target);
        }
      });
    };
    const observer = new IntersectionObserver(onIntersect, options);
    sections.forEach((section) => {
      observer.observe(section);
    });

    document.addEventListener("readystatechange", (e) => {
      if (e.target.readyState === "complete") {
        const scroller = this.#getElement("[data-scroller]");
        header.classList.add("visible");
        scroller.addEventListener("scroll", () => {
          pageDirection = scroller.scrollTop > pagePrevYPos ? "down" : "up";
          pagePrevYPos = scroller.scrollTop;
          header.classList.toggle("visible", pageDirection === "up");
          // searchControls.classList.remove("visible");
          this.#getElement("[data-header-dropdown]").open = false;
        });
      }
    });
    // observe header

    // init filter dropdowns
    const filterGroup = this.#getElement("[data-filter-group]");
    filterGroup.addEventListener("sl-show", (event) => {
      if (event.target.localName === "sl-details") {
        [...filterGroup.querySelectorAll("sl-details")].map(
          (details) => (details.open = event.target === details)
        );
      }
    });
    // init filter dropdowns

    const drawers = document.querySelectorAll("[data-dialog]");
    drawers.forEach((drawer) => {
      const closeBtns = drawer.querySelectorAll("[data-close-modal]");

      closeBtns.forEach((btn) =>
        btn.addEventListener("click", () => drawer.hide())
      );
    });
    const triggers = document.querySelectorAll("[data-trigger-modal]");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        this.#getElement(
          `[data-dialog="${trigger.dataset.triggerModal}"]`
        ).show();
      });
    });

    // Change the animation for a single dialog
    // const dialog = document.querySelector('#my-dialog');

    // setAnimation(dialog, 'dialog.show', {
    //   keyframes: [
    //     { transform: 'rotate(-10deg) scale(0.5)', opacity: '0' },
    //     { transform: 'rotate(0deg) scale(1)', opacity: '1' }
    //   ],
    //   options: {
    //     duration: 500
    //   }
    // });

    // openButton.addEventListener("click", () => drawer.show());
    // closeButton.addEventListener("click", () => drawer.hide());

    // generic
    // generic
    // products
    // products
    // filters
    // filters
    // cart
    // cart
  }

  // util

  bindFormatEmail(handler) {
    this.#getElement("[data-send-order]").addEventListener("click", () => {
      handler();
    });
  }

  isMobile() {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  formatEmail(cart) {
    const br = "\n";
    const line = "-----------------------------";
    let body = "";
    const subject = "ORDER";
    const greeting =
      "Thank you for doing business with us!" +
      br +
      br +
      "Please ensure that all details are correct." +
      br +
      br +
      "NOTE - If any details displayed here are wrong, then please cancel this email and go back to the web page to correct it." +
      br +
      "Then resend your order." +
      br +
      br;
    const contact = "";
    const address = "";
    const comment =
      "Please specify any special intructions re your order/delivery here, or leave us a comment:" +
      br +
      br +
      br +
      "Remember to click *SEND* so that we can start preparing your order immediately." +
      br +
      br +
      "Thanks again for your business!";

    let totalText = "";
    let total = 0;
    let items = "Order details" + br + line + br;
    cart.forEach((item, idx) => {
      items +=
        `${idx + 1}) ${item["id"]}, ${item["description"]}\nPrice: R${item[
          "price"
        ].toFixed(2)}\nQty: ${item["qty"]}\nSize: ${
          item["currSize"]
        }\nColour: ${item["currRandomClr"]}` +
        br +
        line +
        br;
      total += item["price"] * item["qty"];
    });

    totalText = `Total: R${total.toFixed(2)}` + br + line + br + br;

    body = greeting + contact + address + items + totalText + comment;
    let mailtoLink = "";
    if (this.isMobile()) {
      mailtoLink = `https://wa.me/?text=${encodeURIComponent(body)}`;
    } else {
      mailtoLink = `mailto:order@dwc.co.za?subject=${subject}&body=${encodeURIComponent(
        body
      )}`;
    }

    const cartBtn = this.#getElement("[data-send-order]");
    // cartBtn.addEventListener("click", () => {
    cartBtn.href = mailtoLink;
    // });
  }

  #createElement(tag, props = {}) {
    const elem = document.createElement(tag);
    const { className, id, attributes, text, data, dataset, styles } = props;
    text ? (elem.textContent = text) : null;
    className ? (elem.className = className) : null;
    id ? (elem.id = id) : null;
    data ? elem.setAttribute("data", data) : null;
    if (dataset) {
      const values = Object.values(dataset);
      Object.keys(dataset).forEach((key, idx) => {
        elem.dataset[key] = values[idx];
      });
    }
    if (styles) {
      const values = Object.values(styles);
      Object.keys(styles).forEach((key, idx) => {
        elem.style[key] = values[idx];
      });
    }
    if (attributes) {
      const values = Object.values(attributes);
      Object.keys(attributes).forEach((key, idx) => {
        elem[key] = values[idx];
      });
    }
    return elem;
  }

  #getElement(selector) {
    return document.querySelector(selector);
  }

  #getChildElement(parent, selector) {
    return parent.querySelector(selector);
  }

  #getAllChildren(parent, selector) {
    return parent.querySelectorAll(selector);
  }

  #getAllElements(selector) {
    return document.querySelectorAll(selector);
  }
  // util

  // category
  displayCategories(categories) {
    const categorySwiper = this.#getElement("[data-category-swiper]");
    categories.forEach((category) => {
      const categorySlide = this.#createElement("div", {
        className: "swiper-slide",
        dataset: { category: category },
      });
      const categoryTitle = this.#createElement("h1", {
        text: category,
      });
      const categoryBtn = this.#createElement("button", {
        dataset: { viewCategory: category, variant: "open-category" },
        className: "button",
        text: "VIEW",
      });
      categorySlide.append(categoryTitle, categoryBtn);
      categorySwiper.querySelector(".swiper-wrapper").append(categorySlide);
    });
  }

  bindViewCategory(handler) {
    const categoryBtns = this.#getAllElements("[data-view-category]");
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        handler(btn.dataset.viewCategory);
      });
    });
  }

  // bindChangeCategory() {
  //   const categorySwiper = this.#getElement("[data-category-swiper]");
  //   categorySwiper
  // }
  // category

  // products
  #createProductItem(product) {
    const wrapper = this.#createElement("article", {
      dataset: {
        product: "",
        id: product["ITEM CODE"],
        triggerModal: "product",
        // index: idx,
      },
      className: "flow",
    });
    wrapper.tabIndex = 1;

    const header = this.#createElement("header");
    const img = this.#createElement("img", {
      attributes: {
        loading: "lazy",
        // src: `assets/imgs/ballet/ballet_${Math.floor(
        //   Math.random() * 5 + 1
        // )}.jpg`,
        // src: `/src/assets/imgs/product_1.jpg`,
        alt: "img",
      },
    });
    let randomNum = Math.floor(Math.random() * 10);
    // console.log(randomNum)
    img.src = this.imagePath(`./products/${randomNum}.jpg`);
    wrapper.dataset.randomImgNum = randomNum;
    // wrapper.dataset.randomColors = `${this.getRandomColorList(
    //   product["COLOUR"].length
    // )}`;
    // console.log(wrapper.dataset.randomColors)
    // console.log(this.imagePath("./product_1.jpg"));

    header.append(img);

    const details = this.#createElement("div");
    const hgroup = this.#createElement("hgroup");
    const title = this.#createElement("h2", {
      text: product.DESCRIPTION,
    });
    const price = this.#createElement("p", {});
    if (product.PRICE[0] === product.PRICE.at(-1)) {
      price.textContent = `R${product.PRICE[0]}`;
    } else {
      price.textContent = `R${product.PRICE[0]} - R${product.PRICE.at(-1)}`;
    }
    hgroup.append(title, price);

    details.append(hgroup);
    wrapper.append(header, details);
    return wrapper;
  }

  clearDOMProducts() {
    const productList = this.#getElement("[data-product-list]");
    productList.replaceChildren();
  }

  displayProducts(products) {
    const productList = this.#getElement("[data-product-list]");
    [...products].slice(0, 12).forEach((product) => {
      productList.append(this.#createProductItem(product));
    });
    [...productList.children].forEach((child, idx) => {
      child.dataset.index = idx;
    });

    const loadMoreBtn = this.#getElement("[data-load-more]");
    if (products.length > 12) {
      if (!loadMoreBtn.classList.contains("visible")) {
        loadMoreBtn.classList.add("visible");
      }
    } else {
      loadMoreBtn.classList.remove("visible");
    }
  }

  displayMoreProducts(products) {
    let index = 0;
    const limit = 12;
    const productList = this.#getElement("[data-product-list]");
    const lastChild = productList.lastElementChild;
    [...products]
      .slice(+lastChild.dataset.index + 1, +lastChild.dataset.index + 1 + limit)
      .forEach((product) => {
        productList.append(this.#createProductItem(product));
      });
    [...productList.children].forEach((child, idx) => {
      child.dataset.index = idx;
      index = idx;
    });
    const loadMoreBtn = this.#getElement("[data-load-more]");
    if (
      loadMoreBtn.classList.contains("visible") &&
      index + 1 < products.length
    ) {
      loadMoreBtn.classList.add("visible");
    } else {
      loadMoreBtn.classList.remove("visible");
    }
  }

  bindViewMoreProducts(handler) {
    const loadMoreBtn = this.#getElement("[data-load-more]");
    loadMoreBtn.addEventListener("click", () => {
      handler();
    });
  }

  // getRandomColorList(length) {

  // }

  updateProductImgModal(randomImgNum) {
    const modal = this.#getElement('[data-dialog="product-img"]');
    modal.querySelector("img").src = this.imagePath(
      `./products/${randomImgNum}.jpg`
    );
  }

  bindUpdateProductItemQty() {
    const modal = this.#getElement('[data-dialog="product"]');
    const qtyWidget = modal.querySelector("[data-qty-widget]");
    const qtyInput = qtyWidget.querySelector("[data-product-qty-input]");

    qtyWidget
      .querySelector("[data-remove-qty]")
      .addEventListener("click", () => {
        if (+qtyInput.value - 1 >= 1) {
          qtyInput.value = +qtyInput.value - 1;
          // handler(+qtyWidget.dataset.index, -1, { mode: "add" });
        }
      });
    qtyWidget.querySelector("[data-add-qty]").addEventListener("click", () => {
      if (+qtyInput.value + 1 <= 20) {
        qtyInput.value = +qtyInput.value + 1;
        // handler(+qtyWidget.dataset.index, 1, { mode: "add" });
      }
    });
    qtyInput.addEventListener("input", (ev) => {
      ev.target.value = ev.target.value.replace(/[^\d]/g, "");
      if (+ev.target.value >= 20) {
        ev.target.value = 20;
      } else {
        ev.target.value = +ev.target.value;
      }
    });
    qtyInput.addEventListener("change", (ev) => {
      if (+ev.target.value <= 0) {
        ev.target.value = 1;
      }
      // handler(+qtyWidget.dataset.index, +ev.target.value, { mode: "set" });
    });
  }

  fillProductModal(product, randomImgNum) {
    const modal = this.#getElement('[data-dialog="product"]');
    modal.dataset.randomImageNum = randomImgNum;
    modal.dataset.productId = product["ITEM CODE"];
    const qtyWidget = modal.querySelector("[data-qty-widget]");
    const qtyInput = qtyWidget.querySelector("[data-product-qty-input]");
    qtyInput.value = 1;

    const img = modal.querySelector("img");
    img.src = this.imagePath(`./products/${randomImgNum}.jpg`);
    this.#getElement("[data-product-name]").textContent =
      product["DESCRIPTION"];

    const price = this.#getElement("[data-price]");
    if (product.PRICE[0] === product.PRICE.at(-1)) {
      price.textContent = `R${product.PRICE[0]}`;
    } else {
      price.textContent = `R${product.PRICE[0]} - R${product.PRICE.at(-1)}`;
    }

    const sizeList = modal.querySelector("[data-size-list]");
    const colourList = modal.querySelector("[data-colour-list]");

    if (product["SIZE"][0] !== "null") {
      this.#getElement("[data-sizes-input]").hidden = false;
      this.#getElement("[data-sizes-input]").dataset.hidden = false;

      sizeList.replaceChildren();
      sizeList.append(
        ...[...product["SIZE"]].map((size) =>
          this.#createElement("div", { dataset: { size: size }, text: size })
        )
      );
    } else {
      sizeList.replaceChildren();
      this.#getElement("[data-sizes-input]").hidden = true;
      this.#getElement("[data-sizes-input]").dataset.hidden = true;
    }

    if (product["COLOUR"][0] !== "null") {
      this.#getElement("[data-colors-input]").hidden = false;
      this.#getElement("[data-colors-input]").dataset.hidden = false;

      colourList.replaceChildren();
      colourList.append(
        ...[...product["COLOUR"]].map((colour, idx) =>
          this.#createElement("div", {
            dataset: {
              colour: colour,
              hexColour: product["randomColours"][idx],
            },
            styles: { backgroundColor: product["randomColours"][idx] },
          })
        )
      );
    } else {
      colourList.replaceChildren();
      this.#getElement("[data-colors-input]").hidden = true;
      this.#getElement("[data-colors-input]").dataset.hidden = true;
    }
  }

  bindReqProduct(handler) {
    const products = this.#getAllElements("[data-product]");
    const productModal = this.#getElement("[data-dialog='product']");
    products.forEach((product) => {
      product.querySelector("img").addEventListener("click", () => {
        // handler({
        //   id: product.dataset.id,
        //   colour: productModal.querySelector(".inputs .colour-list .selected"),
        //   size: productModal.querySelector(".inputs .size-list .selected"),
        // });
        handler(product.dataset.id, product.dataset.randomImgNum);
        productModal.show();
      });
      product.querySelector("h2").addEventListener("click", () => {
        // handler({
        //   id: product.dataset.id,
        //   colour: productModal.querySelector(".inputs .colour-list .selected"),
        //   size: productModal.querySelector(".inputs .size-list .selected"),
        // });
        handler(product.dataset.id, product.dataset.randomImgNum);
        productModal.show();
      });
    });
  }

  // products

  // filters
  emptyFilterInputs() {
    const searchControls = this.#getElement("[data-search-controls]");
    const searchbarInput = searchControls.querySelector(".searchbar-input");
    const filterGroup = this.#getElement("[data-filter-group]");
    [...filterGroup.children].forEach((child) => child.hide());
    const inputs = filterGroup.querySelectorAll("input[type='checkbox']");
    inputs.forEach((input) => (input.checked = false));
    searchbarInput.value = "";
    this.#getElement("[data-load-more]").classList.remove("visible");
    this.#getElement("[data-filter-count]").textContent = 0;
  }

  updateFilterInputs(filter) {
    const searchControls = this.#getElement("[data-search-controls]");
    const searchbarInput = searchControls.querySelector(".searchbar-input");
    const filterGroup = this.#getElement("[data-filter-group]");
    const filterCount = this.#getElement("[data-filter-count]");
    const categorySlideBtns = this.#getAllElements(".category-swiper .button");
    const inputs = filterGroup.querySelectorAll("input[type='checkbox']");

    if (filter.options.find((item) => item["CATEGORY"])) {
      inputs.forEach((input) => (input.checked = false));
      swiper.slideTo(
        [...categorySlideBtns].findIndex(
          (btn) =>
            btn.dataset.viewCategory.toLowerCase() ===
            filter.options.find((item) => item["CATEGORY"])["CATEGORY"]
        )
      );
    } else {
      swiper.slideTo(0);
    }

    if (filter.options.length > 0) {
      filter.options.forEach((option, idx) => {
        filterGroup.querySelector(
          `[value="${option[Object.keys(option)[0]]}"]`
        ).checked = true;
        filterCount.textContent = idx + 1;
      });
    } else {
      filterCount.textContent = 0;
    }

    searchbarInput.value = filter.searchStr;
  }

  // fillFilterOptions(options) {

  // }

  getFilterOBJ() {
    let obj = {};
    const searchControls = this.#getElement("[data-search-controls]");
    const searchbarInput = searchControls.querySelector(".searchbar-input");
    const filterGroup = this.#getElement("[data-filter-group]");
    const inputs = filterGroup.querySelectorAll("input[type='checkbox']");
    const swiperSlideActive = document.querySelector(".swiper-slide-active");
    const activeBtn = swiperSlideActive.querySelector(".button");
    let mappedCheckboxes = [];
    inputs.forEach(() => {
      const filledCheckboxes = [...inputs].filter((input) => input.checked);
      mappedCheckboxes = [...filledCheckboxes].map((input) => {
        let obj = {};
        obj[`${input.getAttribute("name")}`] = input.value;
        return obj;
      });
      return;
    });

    const categoryOption = mappedCheckboxes.find((obj) => obj["CATEGORY"]);
    if (categoryOption) {
      categoryOption["CATEGORY"] = activeBtn.dataset.viewCategory.toLowerCase();
    }

    // if (categoryOption) {
    // } else {
    //   mappedCheckboxes.push({
    //     CATEGORY: activeBtn.dataset.viewCategory.toLowerCase(),
    //   });
    // }

    // mappedCheckboxes.push({
    //   CATEGORY: activeBtn.datset.viewCategory.toLowerCase(),
    // });
    obj.searchStr = searchbarInput.value;
    obj.options = mappedCheckboxes;

    // obj.options[]
    return obj;
  }

  bindChangeFilters(handler) {
    const applyFilters = this.#getElement("[data-apply-filters]");
    const filterGroup = this.#getElement("[data-filter-group]");
    const inputs = filterGroup.querySelectorAll("input[type='checkbox']");
    const searchForm = this.#getElement("[data-products-searchbar-form]");
    const filterCount = this.#getElement("[data-filter-count]");
    const categorySlideBtns = this.#getAllElements(".category-swiper .button");
    // filterGroup
    applyFilters.addEventListener("click", () => {
      handler(this.getFilterOBJ());
    });

    inputs.forEach((input) => {
      input.addEventListener("click", (ev) => {
        swiper.slideTo(
          [...categorySlideBtns].findIndex(
            (btn) => btn.dataset.viewCategory.toLowerCase() === ev.target.value
          )
        );
        const filterGroup = input.parentElement.parentElement;
        filterGroup.querySelectorAll("input").forEach((input) => {
          if (ev.target !== input) {
            input.checked = false;
          }
        });
        const filledCheckboxes = [...inputs].filter((input) => input.checked);
        if (filledCheckboxes.length > 0) {
          filledCheckboxes.forEach((_, idx) => {
            filterCount.textContent = idx + 1;
          });
        } else {
          filterCount.textContent = 0;
        }
      });
    });

    searchForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      handler(this.getFilterOBJ());
    });

    categorySlideBtns.forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        swiper.slideTo(
          [...categorySlideBtns].findIndex((btn) => btn === ev.target)
        );
        const inputGroup = document.querySelectorAll(
          '.filters [name="CATEGORY"]'
        );
        inputGroup.forEach((input) => (input.checked = false));
        // const inputGroup = [...inputs].filter(input => input.getAttribute("name") === input.getAttribute('name'));
        [...inputs].find(
          (input) => input.value === btn.dataset.viewCategory.toLowerCase()
        ).checked = true;
        handler(this.getFilterOBJ());
      });
    });
  }

  bindClearFilters(handler) {
    const clearFilters = this.#getElement("[data-clear-filters]");

    clearFilters.addEventListener("click", () => {
      handler({ searchStr: "", options: [] });
    });
  }
  // filters

  // cart

  #createCartItem(item) {
    const cartItem = this.#createElement("article", {
      className: "cart-item",
      dataset: { productId: item.id, index: item.index },
    });

    const wrapper = this.#createElement("div");

    const removeIcon = this.#createElement("i", {
      className: "fas fa-trash remove-cart-item",
    });
    const removeBtn = this.#createElement("button", {
      dataset: { removeCartItem: "", index: item.index },
      className: "button",
    });
    removeBtn.append(removeIcon);

    const img = this.#createElement("img");
    img.src = this.imagePath(`./products/${item.randomImgNum}.jpg`);

    const hgroup = this.#createElement("hgroup");
    const title = this.#createElement("h2", {
      text: item.description,
    });
    const price = this.#createElement("p", {
      text: `R${item.price}`,
    });
    hgroup.append(title, price);

    const inputWrapper = this.#createElement("div", {
      className: "input-wrapper",
    });

    // const colorPopup = this.#createElement("sl-popup", {
    //   className: "color-popup",
    //   attributes: {
    //     placement: "top",
    //     arrow: true,
    //     arrowPlacement: "anchor",
    //     distance: 8,
    //     shift: true,
    //   },
    // });

    const colorPicker = this.#createElement("sl-color-picker", {
      attributes: {
        hoist: true,
        noFormatToggle: true,
        swatches: item["randomColours"],
        value: item["currRandomClr"],
      },
      dataset: { initialClr: item["currRandomClr"], index: item["index"] },
    });
    colorPicker.style.setProperty("--swatch-size", "30px");
    colorPicker.updateComplete.then(() => {
      colorPicker.shadowRoot.querySelector(
        ".color-picker__grid"
      ).style.display = "none";
      colorPicker.shadowRoot.querySelector(
        ".color-picker__controls"
      ).style.display = "none";
      colorPicker.shadowRoot.querySelector(
        ".color-picker__user-input"
      ).style.display = "none";
      colorPicker.shadowRoot
        .querySelectorAll(".color-picker__swatch")
        .forEach((swatch) => {
          swatch.addEventListener("click", () => {
            colorPicker.blur();
            // colorPicker.shadowRoot.querySelector(
            //   ".color-dropdown"
            // ).open = false;
          });
        });
    });
    // colorBtn.addEventListener("click", () => {
    //   colorPopup.active = colorPopup.active ? false : true;
    // });

    // colorBtn.addEventListener(
    //   "blur",
    //   (ev) => {
    //     colorPopup.active = false;
    //     console.log(ev.target);
    //   },
    //   false
    // );
    // colorPopup.append(colorBtn, box);

    // colorPopup.updateComplete.then(() => {
    //  colorPopup.addEventListener('sl-reposition', () => {
    //   colorPopup.active = false;
    // })
    // });

    const sizeSelect = this.#createElement("sl-select", {
      dataset: { initialSize: item["currSize"], index: item["index"] },
    });
    const options = [...item.allSizes].map((size) =>
      this.#createElement("sl-option", {
        text: size,
        attributes: { value: size },
      })
    );

    sizeSelect.updateComplete.then(() => {
      sizeSelect.append(...options);

      // sizeSelect.value =
      // const listbox = sizeSelect.shadowRoot.querySelector(".select__listbox");
      const displayInput = sizeSelect.shadowRoot.querySelector(
        ".select__display-input"
      );
      displayInput.value = item.currSize;

      sizeSelect.addEventListener("sl-input", (ev) => {
        displayInput.value = ev.target.value;
      });
      // listbox.addEventListener("click", (ev) => {
      //   sizeSelect.shadowRoot.querySelector(".select__display-input").value =
      //     ev.target.value;
      // });
    });

    if (item["currColour"]) {
      inputWrapper.append(colorPicker);
    }
    if (item["currSize"]) {
      inputWrapper.append(sizeSelect);
    }
    // inputWrapper.append(colorPopup, sizeSelect);
    //  <sl-popup class="add-to-cart-popup" placement="top" arrow arrow-placement="anchor" distance="8">
    //       <button
    //         slot="anchor"
    //         class="button"
    //         data-variant="add-to-cart"
    //         data-add-to-cart
    //       >
    //         Add to cart
    //       </button>
    //       <div class="box">Please select a colour/size</div>
    //     </sl-popup>

    const qtyWidget = this.#createElement("div", {
      dataset: { qtyWidget: "", index: item["index"] },
    });
    const minusBtn = this.#createElement("button", {
      dataset: { removeQty: "" },
      text: "-",
      className: "button",
    });
    const plusBtn = this.#createElement("button", {
      dataset: { addQty: "" },
      text: "+",
      className: "button",
    });
    // const labelForQty = this.#createElement("label", { text: "Qty:" });
    const cartItemQty = this.#createElement("input", {
      attributes: {
        type: "text",
        maxLength: 2,
        value: item.qty,
        inputMode: "numeric",
      },
    });
    qtyWidget.append(minusBtn, cartItemQty, plusBtn);

    wrapper.append(hgroup, inputWrapper, qtyWidget);

    cartItem.append(img, wrapper, removeBtn);
    return cartItem;
  }

  clearCartTotals() {
    this.#getElement("[data-cart-subtotal]").textContent = 0;
    this.#getElement("[data-total-cart-items]").textContent = 0;
  }

  updateCartSubtotal(cart) {
    const total = cart.reduce(
      (total, item) =>
        parseFloat((total = +total + item.qty * item.price)).toFixed(2),
      0
    );
    this.#getElement("[data-cart-subtotal]").textContent = total;
  }

  updateCartTotalItems(cart) {
    const total = cart.reduce((total, item) => (total += item.qty), 0);
    // this.#getElement("[data-total-cart-items]").textContent = total;
    this.#getAllElements("[data-total-cart-items]").forEach((elem) => {
      elem.textContent = total;
    });
    // this.#getElement(".item-modal-cart-items-total").textContent = total;
    // this.#getElement(".header-total-cart-items").textContent = total;
  }

  #clearCart() {
    this.#getElement("[data-cart-items]").replaceChildren();
  }

  displayCart(cart) {
    const cartItems = this.#getElement("[data-cart-items]");
    if (cartItems.children?.length > 0) this.#clearCart();
    if (cart?.length > 0) {
      cart.forEach((item) => {
        cartItems.appendChild(this.#createCartItem(item));
      });
      this.updateCartSubtotal(cart);
      this.updateCartTotalItems(cart);
    } else {
      cartItems.append(
        this.#createElement("p", {
          className: "empty-cart-text",
          text: "No items in cart",
        })
      );
    }
  }

  errorInvalidAddToCart(errorMsg) {
    // const colourList = this.#getElement("[data-colour-list]");

    const inputs = this.#getElement("[data-modal-inputs]");
    const popup = this.#getElement(".add-to-cart-popup");
    const box = popup.querySelector(".box");
    box.textContent = errorMsg;
    popup.active = true;
    if (this.cartTimeoutID) {
      clearTimeout(this.cartTimeoutID);
    }
    this.cartTimeoutID = setTimeout(() => {
      popup.active = false;
    }, 2000);
    const visibleInputs = [...inputs.children].filter((child) => !child.hidden);
    visibleInputs[0].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  addToCartSuccess() {
    const popup = this.#getElement(".add-to-cart-popup");
    const box = popup.querySelector(".box");
    box.textContent = "Item added to cart";
    popup.active = true;
    if (this.cartTimeoutID) {
      clearTimeout(this.cartTimeoutID);
    }
    this.cartTimeoutID = setTimeout(() => {
      popup.active = false;
    }, 2000);
  }

  bindRemoveCartItem(handler) {
    const modal = this.#getElement('[data-dialog="cart"]');
    const btns = modal.querySelectorAll("[data-remove-cart-item]");
    [...btns].forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        handler(+ev.target.dataset.index);
      });
    });
  }

  #mapCartInputsToChanges() {
    const modal = this.#getElement('[data-dialog="cart"]');
    const items = modal.querySelectorAll(".cart-item");
    let editedItems = [...items].filter((item) => {
      if (item.querySelector("[data-edited='true']")) {
        return item;
      }
    });
    let mappedChanges = [...editedItems].map((item) => {
      let obj = { index: item.dataset.index };
      if (item.querySelector('sl-color-picker[data-edited="true"]')) {
        obj.colour = item.querySelector("sl-color-picker").value;
      }
      if (item.querySelector('sl-select[data-edited="true"]')) {
        obj.size = item.querySelector("sl-select").value;
      }
      return obj;
    });
    return mappedChanges;
  }

  #shouldUpdateCart() {
    const modal = this.#getElement('[data-dialog="cart"]');
    const sizeInputs = modal.querySelectorAll("sl-select");
    const colorPickers = modal.querySelectorAll("sl-color-picker");
    const hasEditedSize = [...sizeInputs].some(
      (input) => input.dataset.edited === "true"
    );

    const hasEditedColour = [...colorPickers].some(
      (picker) => picker.dataset.edited === "true"
    );

    if (hasEditedSize || hasEditedColour) {
      return true;
    }
    return false;
  }

  bindUpdateCartItems(handler) {
    this.#getElement("[data-update-cart]").addEventListener("click", () => {
      handler(this.#mapCartInputsToChanges());
      this.#getElement("[data-update-cart]").classList.remove("visible");
    });

    // this.#mapCartInputsToChanges();
    //  const editedColours = [...colorPickers].filter(
    //     (input) => input.dataset.edited === "true"
    //   );
    //   const editedSizes = [...sizeInputs].filter(
    //     (input) => input.dataset.edited === "true"
    //   );
  }

  bindEditCartItems() {
    const modal = this.#getElement('[data-dialog="cart"]');
    const sizeInputs = modal.querySelectorAll("sl-select");
    const colorPickers = modal.querySelectorAll("sl-color-picker");

    this.#getElement("[data-update-cart]").classList.remove("visible");

    colorPickers.forEach((picker) => {
      picker.addEventListener("sl-change", (ev) => {
        if (ev.target.dataset.initialClr !== ev.target.value) {
          ev.target.dataset.edited = true;
        } else if (ev.target.dataset.initialClr === ev.target.value) {
          ev.target.dataset.edited = false;
        }

        if (this.#shouldUpdateCart()) {
          this.#getElement("[data-update-cart]").classList.add("visible");
        } else {
          this.#getElement("[data-update-cart]").classList.remove("visible");
        }
      });
    });

    sizeInputs.forEach((input) => {
      input.addEventListener("sl-change", (ev) => {
        if (ev.target.dataset.initialSize !== ev.target.value) {
          ev.target.dataset.edited = true;
        } else if (ev.target.dataset.initialSize === ev.target.value) {
          ev.target.dataset.edited = false;
        }

        if (this.#shouldUpdateCart()) {
          this.#getElement("[data-update-cart]").classList.add("visible");
        } else {
          this.#getElement("[data-update-cart]").classList.remove("visible");
        }
      });
    });
    // console.log(sizeInputs)

    // const updateCartBtn = this.#getElement("[data-update-cart]");
    // updateCartBtn.addEventListener("click", () => {
    // handler();
    // });
  }

  bindUpdateCartItemQty(handler) {
    // console.log("hi");
    const modal = this.#getElement('[data-dialog="cart"]');
    const widgets = modal.querySelectorAll("[data-qty-widget]");
    widgets.forEach((widget) => {
      const input = widget.querySelector("input");
      widget
        .querySelector("[data-remove-qty]")
        .addEventListener("click", () => {
          if (+input.value - 1 >= 1) {
            input.value = +input.value - 1;
            handler(+widget.dataset.index, -1, { mode: "add" });
          }
        });
      widget.querySelector("[data-add-qty]").addEventListener("click", () => {
        if (+input.value + 1 <= 20) {
          input.value = +input.value + 1;

          handler(+widget.dataset.index, 1, { mode: "add" });
        }
      });
      input.addEventListener("input", (ev) => {
        ev.target.value = ev.target.value.replace(/[^\d]/g, "");
        if (+ev.target.value >= 20) {
          ev.target.value = 20;
        } else {
          ev.target.value = +ev.target.value;
        }
      });
      input.addEventListener("change", (ev) => {
        if (+ev.target.value <= 0) {
          ev.target.value = 1;
        }
        handler(+widget.dataset.index, +ev.target.value, { mode: "set" });
      });
    });
  }

  createCartItemHandler(handler) {
    const modal = this.#getElement('[data-dialog="product"]');

    const colourList = this.#getElement("[data-colour-list]");
    const sizeList = this.#getElement("[data-size-list]");

    const sizesInput = this.#getElement("[data-sizes-input]");
    const colorsInput = this.#getElement("[data-colors-input]");
    handler(
      modal.dataset.productId,
      +modal.querySelector("[data-product-qty-input]").value,
      modal.querySelector("hgroup>h1").textContent,
      sizesInput.hidden
        ? null
        : sizeList.querySelector(".selected")?.dataset?.size,
      colorsInput.hidden
        ? null
        : colourList.querySelector(".selected")?.dataset?.colour,
      modal.dataset.randomImageNum,
      colorsInput.hidden
        ? null
        : colourList.querySelector(".selected")?.dataset?.hexColour
    );
  }

  bindCreateCartItem(handler) {
    // const modal = this.#getElement('[data-dialog="product"]');
    // const qtyWidget = modal.querySelector("[data-qty-widget]");
    // const qtyInput = qtyWidget.querySelector("[data-product-qty-input]");

    const colourList = this.#getElement("[data-colour-list]");
    const sizeList = this.#getElement("[data-size-list]");

    const sizesInput = this.#getElement("[data-sizes-input]");
    const colorsInput = this.#getElement("[data-colors-input]");

    // const popup = this
    // .#getElement(".add-to-cart-popup");
    // const box = popup.querySelector(".box");

    this.#getElement("[data-add-to-cart]").addEventListener("click", () => {
      if (sizesInput.hidden || colorsInput.hidden) {
        if (sizesInput.hidden && colorsInput.hidden) {
          this.createCartItemHandler(handler);
        } else if (
          sizeList.querySelector(".selected")?.dataset?.size ||
          colourList.querySelector(".selected")?.dataset?.colour
        ) {
          this.createCartItemHandler(handler);
        } else {
          this.errorInvalidAddToCart("Please select a color/size");
        }
      } else {
        if (
          sizeList.querySelector(".selected")?.dataset?.size &&
          colourList.querySelector(".selected")?.dataset?.colour
        ) {
          this.createCartItemHandler(handler);
        } else {
          this.errorInvalidAddToCart("Please select a color/size");
        }
      }
    });
  }

  bindClearCart(handler) {
    const modal = this.#getElement('[data-dialog="empty-cart"]');
    const emptyCartBtn = modal.querySelector("[data-empty-cart]");
    const totalCartItems = this.#getAllElements("[data-total-cart-items]");
    emptyCartBtn.addEventListener("click", () => {
      handler();
      totalCartItems.forEach((elem) => {
        elem.textContent = 0;
      });
      this.#getElement("[data-cart-subtotal]").textContent = "0";
    });
  }
  // cart
}
