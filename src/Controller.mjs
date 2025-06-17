import Fuse from "fuse.js";
export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // filters
    this.model.bindFiltersChanged(this.onFiltersChanged);
    this.model.updateFilters({ COLOUR: "=pink", SIZE: "lrg" });
    // filters

    // init
    // this.view.fillCategoryList(this.model.getCategories());
    // this.view.fillFilterOptions({
    //   categories: this.model.getCategories(),
    //   priceRange: this.model.getPriceRange(),
    // });
    // init
  }

  // filter
  onFiltersChanged = () => {
    const filterKeys = Object.keys(this.model.productFilters);
    const fuse = new Fuse([...this.model.products], {
      keys: filterKeys,
      useExtendedSearch: true,
      findAllMatches: true,
    });
    const filteredProducts = fuse
      .search({
        $and: [this.model.productFilters],
      })
      .map((product) => product["item"]);
    const filteredUniq = this.model.getFilteredInUniq(filteredProducts);
    // this.view.updateFilterInputs(this.model.productFilters);
    // this.view.displayProducts(groupedProducts);
  };
}
// filter

// const product = document.querySelector(".product");
// product.addEventListener("click", () => {

// })
