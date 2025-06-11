export default class Model {
  constructor(products) {
    this.products = products || [];
    // this.cartItems = this.#getCart();
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
  #condenseProductGroup(group) {
    const priceRange = this.getPriceRange(group);
    const obj = {
      DESCRIPTION: group[0].DESCRIPTION,
      "ITEM CODE": group[0]["ITEM CODE"],
      PRICE: [priceRange.min, priceRange.max],
      COLOURS: Object.keys(this.#getUniqEntries(group, "COLOUR")),
      SIZES: Object.keys(this.#getUniqEntries(group, "SIZE")).sort(
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
    this.onFiltersChanged(this.products, this.productFilters);
    this.#commit(sessionStorage, "product_filters", this.productFilters);
  }

  updateFilters(filters) {
    this.productFilters = filters;
    this.onFiltersChanged(this.products, this.productFilters);
    this.#commit(sessionStorage, "product_filters", this.productFilters);
  }

  bindFiltersChanged(callback) {
    this.onFiltersChanged = callback;
  }

  #getFilters() {
    return JSON.parse(sessionStorage.getItem("product_filters"));
  }
  // filter
}
