// import { setDefaultAnimation } from '@shoelace-style/shoelace/dist/utilities/animation-registry.js';
import Swiper from "swiper";
import { Navigation, /*,*/ Pagination, Parallax } from "swiper/modules";
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
  }
  #init() {
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
        updateCategoryBG(activeSlide.dataset.category);
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
        ].toFixed(2)}\nQty: ${item["qty"]}\nSize: ${item["size"]}\nColour: ${
          item["colour"]
        }` +
        br +
        line +
        br;
      total += item["price"] * item["qty"];
    });

    totalText = `Total: R${total.toFixed(2)}` + br + line + br + br;

    body = greeting + contact + address + items + totalText + comment;
    const mailtoLink = `mailto:order@dwc.co.za?subject=${subject}&body=${encodeURIComponent(
      body
    )}`;

    const cartBtn = this.#getElement("[data-cart-btn]");
    cartBtn.addEventListener("click", () => {
      cartBtn.href = mailtoLink;
    });
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

  fillProductModal(product) {
    this.#getElement("[data-product-name]").textContent =
      product["DESCRIPTION"];
    const price = this.#getElement("[data-price]");
    if (product.PRICE[0] === product.PRICE.at(-1)) {
      price.textContent = `R${product.PRICE[0]}`;
    } else {
      price.textContent = `R${product.PRICE[0]} - R${product.PRICE.at(-1)}`;
    }
  }

  bindReqProduct(handler) {
    const products = this.#getAllElements("[data-product]");
    const productModal = this.#getElement("[data-drawer='product']");
    products.forEach((product) => {
      product.querySelector("img").addEventListener("click", () => {
        handler(product.dataset.id);
        productModal.show();
      });
      product.querySelector("h2").addEventListener("click", () => {
        handler(product.dataset.id);
        productModal.show();
      });
    });
  }

  // products

  // filters
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
  // cart
}
