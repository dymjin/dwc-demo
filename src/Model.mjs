export default class Model {
  constructor(products) {
    this.products = products || [];
    this.cartItems = this.#getCart() || [];
    this.productFilters = this.#getFilters() || {};
    this.#getUniqProductVariants() || this.#setUniqProductVariants();
    this.uniqProducts = this.#getUniqProductVariants();
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
    const cartItemsByID = Object.groupBy(
      this.cartItems,
      (item) => item.productID
    );
    const grouped2DArr = Object.values(cartItemsByID).map((group) => {
      return (group = group.reduce((acc, groupItem) => {
        const matchItem = acc.find(
          (item) =>
            item["colour"] === groupItem["colour"] &&
            item["size"] === groupItem["size"] &&
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

  addCartItem(description, price, id, qty, size, colour) {
    const duplicateItem = [...this.cartItems].find((item) => {
      return (
        item["description"] === description &&
        item["price"] === price &&
        item["size"] === size &&
        item["colour"] === colour &&
        item["id"] === id
      );
    });
    if (!!duplicateItem && Object.hasOwn(duplicateItem, "id")) {
      this.updateCartItemQty(duplicateItem);
      this.#commit(localStorage, "cart_items", this.cartItems);
    } else {
      this.cartItems.push({ description, price, id, qty, size, colour });
      this.onCartChanged();
    }
  }

  editCartItem(changes, index) {
    const item = [...this.cartItems].find((item) => item["index"] === index);
    if (item) {
      Object.keys(changes).forEach((key) => (item[key] = changes[key]));
    }
    this.onCartChanged();
  }

  updateCartItemQty(item) {
    item.qty = item.qty + 1;
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

  bindCartChanged(callback) {
    this.onCartChanged = callback;
  }
  // cart
}
