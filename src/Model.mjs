export default class Model {
  constructor(products) {
    this.products = products || [];
    this.cartItems = this.#getCart() || [];
    this.productFilters = this.#getFilters() || {};
    this.#getUniqProductVariants() || this.#setUniqProductVariants();
    this.uniqProducts = this.#getUniqProductVariants();
    this.randomColors = [
      "#fdc700",
      "#c10007",
      "#024a70",
      "#e9d4ff",
      "#fb64b6",
      "#6e11b0",
      "#ff2056",
      "#1447e6",
      "#fafafa",
      "#0c0a09",
    ];
    if (!localStorage.getItem("randomClrsDone")) {
      this.mapToRandomColor();
    }
  }

  // introduce random colors
  getRandomColors(length) {
    let randomIDX = Math.floor(
      Math.random() * (this.randomColors.length - length)
    );
    return this.randomColors.slice(randomIDX, randomIDX + length);
  }

  mapToRandomColor() {
    this.uniqProducts.forEach((product) => {
      product.randomColours = this.getRandomColors(product["COLOUR"].length);
    });
    this.#commit(localStorage, "uniq_products", this.uniqProducts);
    this.#commit(localStorage, "randomClrsDone", true);
  }

  // util

  #commit(storageType, name, value) {
    storageType.setItem(name, JSON.stringify(value));
  }

  #getUniqEntries(arr, key) {
    return Object.groupBy(arr, (item) => item[key]);
  }

  getCategories() {
    const categories = this.#getUniqEntries(this.products, "CATEGORY");
    return Object.keys(categories);
  }

  getPriceRange(list) {
    const sorted = list.sort((a, b) => a.PRICE - b.PRICE);
    return { min: sorted[0].PRICE, max: sorted.at(-1).PRICE };
  }
  // util

  // product
  getUniqProduct(id) {
    return this.uniqProducts.find((item) => item["ITEM CODE"] === id);
  }

  getProduct(details) {
    return this.products.find(
      (item) =>
        item["ITEM CODE"] === details["id"] &&
        item["COLOUR"] === details["currColour"] &&
        item["SIZE"] === details["currSize"]
    );
  }

  #condenseProductGroup(group) {
    const priceRange = this.getPriceRange(group);
    const obj = {
      DESCRIPTION: group[0].DESCRIPTION,
      "ITEM CODE": group[0]["ITEM CODE"],
      PRICE: [priceRange.min, priceRange.max],
      COLOUR: Object.keys(this.#getUniqEntries(group, "COLOUR")),
      SIZE: Object.keys(this.#getUniqEntries(group, "SIZE")).sort(
        (a, b) => a - b
      ),
    };
    return obj;
  }

  #setUniqProductVariants() {
    const uniqIDProducts = this.#getUniqEntries(
      [...this.products],
      "ITEM CODE"
    );
    const uniqProducts = Object.values(uniqIDProducts).map((group) =>
      this.#condenseProductGroup(group)
    );
    this.#commit(localStorage, "uniq_products", uniqProducts);
  }

  #getUniqProductVariants() {
    return JSON.parse(localStorage.getItem("uniq_products"));
  }
  // product

  // filter
  clearFilters() {
    this.productFilters = {};
    this.#commit(sessionStorage, "product_filters", this.productFilters);
    this.onFiltersChanged();
  }

  updateFilters(filters) {
    this.productFilters = filters;
    this.#commit(sessionStorage, "product_filters", this.productFilters);
    this.onFiltersChanged();
  }

  bindFiltersChanged(callback) {
    this.onFiltersChanged = callback;
  }

  #getFilters() {
    return JSON.parse(sessionStorage.getItem("product_filters"));
  }

  getFilteredInUniq(filteredProducts) {
    const filteredProductsIDs = Object.groupBy(
      [...filteredProducts],
      (product) => product["ITEM CODE"]
    );
    let diff = [];
    for (const id in filteredProductsIDs) {
      diff.push(
        this.uniqProducts.find((product) => product["ITEM CODE"] === id)
      );
    }
    return diff;
  }
  // filter

  // cart
  #sortCart() {
    [...this.cartItems].forEach((item, idx) => (item.index = idx));
  }
  #condenseCartItems() {
    // based on and expanded on: https://stackoverflow.com/a/67796742
    const cartItemsByID = Object.groupBy(this.cartItems, (item) => item["id"]);
    const grouped2DArr = Object.values(cartItemsByID).map((group) => {
      return (group = group.reduce((acc, groupItem) => {
        const matchItem = acc.find(
          (item) =>
            item["currColour"] === groupItem["currColour"] &&
            item["currSize"] === groupItem["currSize"] &&
            item.index !== groupItem.index
        );
        matchItem ? (acc[0].qty += groupItem.qty) : acc.push(groupItem);
        return acc;
      }, []));
    });
    return grouped2DArr.flat(1);
  }

  updateCart() {
    this.cartItems = this.#condenseCartItems();
    this.#sortCart();
    this.#commit(localStorage, "cart_items", this.cartItems);
  }

  addCartItem(
    id,
    qty,
    price,
    description,
    currSize,
    currColour,
    allSizes,
    allColours,
    randomImgNum,
    randomColours,
    currRandomClr
  ) {
    // console.log(currSize, currColour);
    const duplicateItem = [...this.cartItems].find(
      (item) =>
        item["currSize"] === currSize &&
        item["currRandomClr"] === currRandomClr &&
        item["id"] === id
    );
    if (!!duplicateItem && Object.hasOwn(duplicateItem, "id")) {
      this.updateCartItemQty(duplicateItem, qty, { mode: "add" });
      this.onCartChanged();
      this.#commit(localStorage, "cart_items", this.cartItems);
    } else {
      this.cartItems.push({
        id,
        qty,
        price,
        description,
        currSize,
        currColour,
        allSizes,
        allColours,
        randomImgNum,
        randomColours,
        currRandomClr,
      });
      this.onCartChanged();
    }
    this.#sortCart();
  }

  #removeDuplicateItemsIncrQty(cart) {
    // based on and expanded on: https://stackoverflow.com/a/67796742
    const cartItemsByID = Object.groupBy(cart, (item) => item["id"]);
    const grouped2DArr = Object.values(cartItemsByID).map((group) => {
      return (group = group.reduce((acc, groupItem) => {
        const matchItem = acc.find(
          (item) =>
            item["currRandomClr"] === groupItem["currRandomClr"] &&
            item["currSize"] === groupItem["currSize"] &&
            item["index"] !== groupItem["index"]
        );
        matchItem ? (acc[0].qty += groupItem.qty) : acc.push(groupItem);
        return acc;
      }, []));
    });
    return grouped2DArr.flat(1);
  }

  editCartItems(changes) {
    // let itemsToEdit = [...this.cartItems].filter(item =>

    // )
    changes.forEach((change) => {
      if (change.colour) {
        this.cartItems[change.index]["currRandomClr"] = change.colour;
      }
      if (change.size) {
        this.cartItems[change.index]["currSize"] = change.size;
      }
    });

    this.cartItems = this.#removeDuplicateItemsIncrQty(this.cartItems);

    this.onCartChanged();
    // console.log(this.cartItems)
    // Object.keys(changes).forEach((key) => (item[key] = changes[key]));

    // Object.values(changes).forEach((changeGroup) => {
    //   changeGroup.forEach((change) => {
    //     const item = [...this.cartItems].find(
    //       (item) => item["index"] === +change["index"]
    //     );

    //   });
    // });
    // if (item) {
    //   Object.keys(changes).forEach((key) => (item[key] = changes[key]));
    // }
    // this.onCartChanged();
  }

  updateCartItemQty(item, qty, modeOBJ) {
    if (modeOBJ.mode === "add") {
      item.qty = item.qty + qty;
    } else if (modeOBJ.mode === "set") {
      item["qty"] = qty;
    }
  }

  removeCartItem(index) {
    this.cartItems = this.cartItems.filter((item) => item["index"] !== index);
    this.onCartChanged();
  }

  clearCart() {
    this.cartItems = [];
    this.onCartChanged();
  }

  #getCart() {
    return JSON.parse(localStorage.getItem("cart_items"));
  }

  getCartItem(idx) {
    return this.cartItems.find((item) => item["index"] === idx);
  }

  bindCartChanged(callback) {
    this.onCartChanged = callback;
  }
  // cart
}
